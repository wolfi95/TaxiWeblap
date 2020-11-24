using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Dal
{
    public class TaxiServiceContext : IdentityDbContext<User>
    {
        private readonly IConfiguration configuration;
        public DbSet<Reservation> Reservations{ get; set; }
        public DbSet<Preference> Preferences { get; set; }
        public DbSet<ReservationPreference> ReservationPreferences { get; set; }

        public TaxiServiceContext(DbContextOptions options, IConfiguration configuration) : base(options)
        {
            this.configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {        
            base.OnConfiguring(builder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Preference>().HasData(new List<Preference> {
                new Preference
                {
                    Id = 1,
                    Text = "Example1"
                },
                new Preference
                {
                    Id = 2,
                    Text = "Example2"
                },
                new Preference
                {
                    Id = 3,
                    Text = "Example3"
                }
            });
        }
    }
}
