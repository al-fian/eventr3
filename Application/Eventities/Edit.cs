using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Eventities
{
    public class Edit
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
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var eventity = await _context.Eventities!.FindAsync(request.Eventity!.Id);

                if (eventity == null) return null!;

                _mapper.Map(request.Eventity, eventity);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to update event");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}