using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimberWebapp.Dal.Helpers;
using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Models;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Dal
{
    public class TaxiServiceContext : IdentityDbContext<User>
    {
        private readonly IConfiguration configuration;
        public DbSet<Reservation> Reservations{ get; set; }
        public DbSet<Preference> Preferences { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<ReservationPreference> ReservationPreferences { get; set; }
        public DbSet<ApplicationClient> Clients { get; set; }
        public DbSet<Worker> Workers { get; set; }

        public TaxiServiceContext(DbContextOptions options, IConfiguration configuration) : base(options)
        {
            this.configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            if (configuration["DatabaseType"] == "POSTGRES")
            {
                var connectionString = "";
                if (Environment.GetEnvironmentVariable("DATABASE_URL") == null)
                {
                    connectionString = configuration.GetConnectionString("TaxiServiceContextPostgres");
                }
                else
                {
                    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
                }
                var stringBuilder = new PostgreSqlConnectionStringBuilder(connectionString)
                {
                    Pooling = true,
                    TrustServerCertificate = true,
                    SslMode = SslMode.Require
                };
                var connectionUrl = stringBuilder.ConnectionString;
                builder.UseNpgsql(connectionUrl, builder =>
                {
                    builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                });
            }
            base.OnConfiguring(builder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasDiscriminator(d => d.Role)
                .HasValue<User>(Entities.Authentication.UserRoles.Administrator)
                .HasValue<ApplicationClient>(Entities.Authentication.UserRoles.User)
                .HasValue<Worker>(Entities.Authentication.UserRoles.Worker);

            modelBuilder.Entity<Discount>()
                .HasIndex(d => d.DiscountCode)
                .IsUnique();
            
            modelBuilder.Entity<Preference>().HasData(new List<Preference> {
                new Preference
                {
                    Id = 1,
                    Text = "Smoking"
                },
                new Preference
                {
                    Id = 2,
                    Text = "Pets allowed"
                },
                new Preference
                {
                    Id = 3,
                    Text = "Big trunk"
                }
            });
        }
    }
}
