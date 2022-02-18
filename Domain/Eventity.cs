using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Eventity
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? Venue { get; set; }
        public bool IsCancelled { get; set; }
        public ICollection<EventityAttendee> Attendees { get; set; } = new List<EventityAttendee>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}