using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Eventities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Eventity? Eventity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Eventity).SetValidator(new EventityValidator()!);
            }
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
                var user = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUsername());
                
                var attendee = new EventityAttendee
                {
                    AppUser = user,
                    Eventity = request.Eventity,
                    IsHost = true
                };

                request.Eventity!.Attendees!.Add(attendee);

                _context.Eventities!.Add(request.Eventity!);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create event");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}