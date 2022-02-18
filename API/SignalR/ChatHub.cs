using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.EventityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var eventityId = httpContext!.Request.Query["eventityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, eventityId);
            var result = await _mediator.Send(new List.Query{EventityId = Guid.Parse(eventityId)});
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}