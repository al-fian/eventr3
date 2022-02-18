using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Eventities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<EventityDto>>> 
        {
            public EventityParams? Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<EventityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<PagedList<EventityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Eventities!
                    .Where(d => d.Date >= request.Params!.StartDate)
                    .OrderBy(d => d.Date)
                    .ProjectTo<EventityDto>(_mapper.ConfigurationProvider,
                        new {currentUsername = _userAccessor.GetUsername()})
                    .AsQueryable();
                
                if (request.Params!.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUsername()));
                }

                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUsername == _userAccessor.GetUsername());
                }

                return Result<PagedList<EventityDto>>.Success(
                    await PagedList<EventityDto>.CreateAsync(query, request.Params!.PageNumber,
                        request.Params!.PageSize)
                );
            }
        }
    }
}