using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class EventityAttendee
    {
        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }
        public Guid EventityId { get; set; }
        public Eventity? Eventity { get; set; }
        public bool IsHost { get; set; }
    }
}