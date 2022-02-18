using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any() && !context.Eventities!.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }

                var Eventities = new List<Eventity>
                {
                    new Eventity
                    {
                        Title = "Past Eventity 1",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Eventity 2 months ago",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            }
                        }
                    },
                    new Eventity
                    {
                        Title = "Past Eventity 2",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Eventity 1 month ago",
                        Category = "culture",
                        City = "Paris",
                        Venue = "The Louvre",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new EventityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 1",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Eventity 1 month in future",
                        Category = "music",
                        City = "London",
                        Venue = "Wembly Stadium",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            },
                            new EventityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Eventity 2 months in future",
                        Category = "food",
                        City = "London",
                        Venue = "Jamies Italian",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new EventityAttendee
                            {
                                AppUser = users[2],
                                IsHost = false
                            },
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Eventity 3 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[1],
                                IsHost = true                            
                            },
                            new EventityAttendee
                            {
                                AppUser = users[0],
                                IsHost = false                            
                            },
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Eventity 4 months in future",
                        Category = "culture",
                        City = "London",
                        Venue = "British Museum",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[1],
                                IsHost = true                            
                            }
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 5",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Eventity 5 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Punch and Judy",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true                            
                            },
                            new EventityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 6",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Eventity 6 months in future",
                        Category = "music",
                        City = "London",
                        Venue = "O2 Arena",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[2],
                                IsHost = true                            
                            },
                            new EventityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 7",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Eventity 7 months in future",
                        Category = "travel",
                        City = "Berlin",
                        Venue = "All",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true                            
                            },
                            new EventityAttendee
                            {
                                AppUser = users[2],
                                IsHost = false                            
                            },
                        }
                    },
                    new Eventity
                    {
                        Title = "Future Eventity 8",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Eventity 8 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<EventityAttendee>
                        {
                            new EventityAttendee
                            {
                                AppUser = users[2],
                                IsHost = true                            
                            },
                            new EventityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    }
                };

                await context.Eventities!.AddRangeAsync(Eventities);
                await context.SaveChangesAsync();
            }
        }
    }
}
