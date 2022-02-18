using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Eventity>? Eventities { get; set; }
        public DbSet<EventityAttendee>? EventityAttendees { get; set; }
        public DbSet<Photo>? Photos { get; set; }
        public DbSet<Comment>? Comments { get; set; }
        public DbSet<UserFollowing>? UserFallowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<EventityAttendee>(x => x.HasKey(ea => new {ea.AppUserId, ea.EventityId}));

            builder.Entity<EventityAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(e => e.Eventities)
                .HasForeignKey(ea => ea.AppUserId);
            
            builder.Entity<EventityAttendee>()
                .HasOne(u => u.Eventity)
                .WithMany(e => e.Attendees)
                .HasForeignKey(ea => ea.EventityId);
            
            builder.Entity<Comment>()
                .HasOne(e => e.Eventity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b => 
            {
                b.HasKey(k => new {k.ObserverId, k.TargetId});

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}