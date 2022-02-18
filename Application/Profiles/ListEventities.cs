using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListEventities
    {
        public class Query : IRequest<Result<List<UserEventityDto>>>
        {
            public string? Username { get; set; }
            public string? Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserEventityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<UserEventityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.EventityAttendees!
                    .Where(u => u.AppUser!.UserName == request.Username)
                    .OrderBy(e => e.Eventity!.Date)
                    .ProjectTo<UserEventityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();
                
                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.Now),
                    "hosting" => query.Where(a => a.HostUsername == request.Username),
                    _ => query.Where(a => a.Date >= DateTime.Now)
                };

                var eventities = await query.ToListAsync();

                return Result<List<UserEventityDto>>.Success(eventities);
            }
        }
    }
}