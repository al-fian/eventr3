using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Eventities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var eventity = await _context.Eventities!
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);
                
                if (eventity == null) return null!;

                var user = await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUsername());
                
                if (user == null) return null!;

                var hostUsername = eventity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = eventity.Attendees.FirstOrDefault(x => x.AppUser?.UserName == user.UserName);

                if (attendance != null && hostUsername == user.UserName)
                    eventity.IsCancelled = !eventity.IsCancelled; 
                
                if (attendance != null && hostUsername != user.UserName)
                    eventity.Attendees.Remove(attendance);
                
                if (attendance == null)
                {
                    attendance = new EventityAttendee
                    {
                        AppUser = user,
                        Eventity = eventity,
                        IsHost = false
                    };

                    eventity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
                
            }
        }
    }
}