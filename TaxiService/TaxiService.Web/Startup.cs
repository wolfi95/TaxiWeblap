using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BarionClientLibrary;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SimberWebapp.Dal.Helpers;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Bll.Services;
using TaxiService.Dal;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Web.Middlewares;

namespace TaxiService.Web 
{
    public class Startup
    {
        private readonly IConfiguration configuration;

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = true;
            });

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.KnownNetworks.Clear();
                options.KnownProxies.Clear();
                options.ForwardedHeaders =
                    ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddIdentity<User, IdentityRole>()
               .AddEntityFrameworkStores<TaxiServiceContext>()
               .AddDefaultTokenProviders();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero // remove delay of token when expire
                };
            });
            if(configuration["DatabaseType"] == "POSTGRES") {
                var connectionString = "";
                if (Environment.GetEnvironmentVariable("DATABASE_URL") == null)
                {
                    connectionString = configuration.GetConnectionString("TaxiServiceContextPostgres");
                }
                else
                {
                    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
                }
                var builder = new PostgreSqlConnectionStringBuilder(connectionString)
                {
                    Pooling = true,
                    TrustServerCertificate = true,
                    SslMode = SslMode.Require
                };
                var connectionUrl = builder.ConnectionString;
                services.AddDbContext<TaxiServiceContext>(o => o.UseNpgsql(connectionUrl));
            }
            else
            {
                services.AddDbContext<TaxiServiceContext>(options =>
                    options.UseSqlServer(configuration.GetConnectionString("TaxiServiceContext"))
                );
            }
            
            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "MuNyi API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
            });

            services.AddCors();

            var barionSettings = new BarionSettings
            {
                BaseUrl = new Uri(configuration["Barion:Url"]),
                POSKey = Guid.Parse(configuration["Barion:POS"]),
                Payee = configuration["Barion:PayeeEmail"],
            };

            services.AddSingleton(barionSettings);
            services.AddTransient<BarionClient>();
            services.AddHttpClient<BarionClient>();

            services.AddScoped<IPreferenceService, PreferenceService>();
            services.AddScoped<IReservationService, ReservationService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IWorkerService, WorkerService>();
            services.AddScoped<IEmailService, EmailService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseForwardedHeaders();
                app.UseHsts();
            }

            if (string.IsNullOrWhiteSpace(env.WebRootPath))
            {
                env.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp");
            }

            if (!roleManager.RoleExistsAsync(UserRoles.User).Result)
                roleManager.CreateAsync(new IdentityRole { Name = UserRoles.User }).Wait();
            if (!roleManager.RoleExistsAsync(UserRoles.Administrator).Result)
                roleManager.CreateAsync(new IdentityRole { Name = UserRoles.Administrator }).Wait();
            if (!roleManager.RoleExistsAsync(UserRoles.Worker).Result)
                roleManager.CreateAsync(new IdentityRole { Name = UserRoles.Worker }).Wait();

            var user = userManager.FindByEmailAsync(configuration["Admin:Email"]);
            user.Wait();
            if (user.Result == null)
            {
                var cu = userManager.CreateAsync(new User
                {
                    Email = configuration["Admin:Email"],
                    UserName = configuration["Admin:Email"],
                    Address = configuration["Admin:Address"],
                    Role = UserRoles.Administrator,
                    Name = configuration["Admin:Name"],
                });
                cu.Wait();
                var u = userManager.FindByEmailAsync(configuration["Admin:Email"]);
                u.Wait();
                userManager.AddPasswordAsync(u.Result, configuration["Admin:Password"]).Wait();
                userManager.AddToRoleAsync(u.Result, UserRoles.Administrator).Wait();
            }

            var worker1 = userManager.FindByEmailAsync("worker1@taxiservice.com");
            worker1.Wait();
            if (worker1.Result != null)
            {
                var w = userManager.FindByEmailAsync("worker1@taxiservice.com");
                w.Wait();
                var x = userManager.AddPasswordAsync(w.Result, "WorkerPass1");
                x.Wait();
                userManager.AddToRoleAsync(w.Result, UserRoles.Worker).Wait();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Taxi API V1");
            });

            app.UseHttpsRedirection();

            app.UseCors(options => options.WithOrigins("http://localhost:3000", "*.herokuapp.com", "*.barion.com").AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseMiddleware<ExceptionHandlerMiddleware>();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "startdebug");
                }
            });
            

        }
    }
}
