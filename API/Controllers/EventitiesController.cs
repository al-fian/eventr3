using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Eventities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class EventitiesController : BaseApiController
    {

        [HttpGet]
        public async Task<IActionResult> GetEventities([FromQuery]EventityParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventity(Guid id)
        {

            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateEventity([FromBody]Eventity eventity)
        {
            return HandleResult(await Mediator.Send(new Create.Command{Eventity = eventity}));
        }

        [Authorize(Policy = "IsEventityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditEventity(Guid id, Eventity eventity)
        {
            eventity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Eventity = eventity}));
        }

        [Authorize(Policy = "IsEventityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}