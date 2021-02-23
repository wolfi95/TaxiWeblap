using GoogleMapsApi;
using GoogleMapsApi.Entities.Directions.Request;
using GoogleMapsApi.Entities.Directions.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Models;
using TaxiService.Dal.Entities.Modles;
using TaxiService.Dal.Enums;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.Utils;

namespace TaxiService.Bll.Services
{
    public class ReservationService : IReservationService
    {
        private readonly TaxiServiceContext context;
        private readonly IConfiguration configuration;


        private static readonly PointF[] ccDevider =
        {
            new PointF{X = (float) -0.1047996, Y = (float) 51.4988006},
            new PointF{X = (float) -0.1308328, Y = (float) 51.5274127}
        };

        private static readonly PointF[] heathrow = {
            new PointF ((float)51.482870,(float) -0.491790),
            new PointF ((float)51.462144,(float) -0.492728),
            new PointF ((float)51.455245,(float) -0.445950),
            new PointF ((float)51.473392,(float) -0.410652),
            new PointF ((float)51.480569,(float) -0.419257),
        };
        private static readonly PointF[] gatwick = {
            new PointF ((float)51.170079,(float) -0.183028),
            new PointF ((float)51.150614,(float) -0.216081),
            new PointF ((float)51.141666,(float) -0.212855),
            new PointF ((float)51.147962,(float) -0.160337),
            new PointF ((float)51.159698,(float) -0.160648),
        };
        private static readonly PointF[] stansted = {
            new PointF ((float)51.878144,(float) 0.204122),
            new PointF ((float)51.887462,(float) 0.208896),
            new PointF ((float)51.888920,(float) 0.230313),
            new PointF ((float)51.902704,(float) 0.260300),
            new PointF ((float)51.894850,(float) 0.275398),
            new PointF ((float)51.875756,(float) 0.255908),
            new PointF ((float)51.871444,(float) 0.213894),
        };
        private static readonly PointF[] londonCity = {
            new PointF ((float)51.505385,(float) 0.034283),
            new PointF ((float)51.505394,(float) 0.066997),
            new PointF ((float)51.501607,(float) 0.069647),
            new PointF ((float)51.502689,(float) 0.049412),
            new PointF ((float)51.502429,(float) 0.034306),
        };
        private static readonly PointF[] southend = {
            new PointF ((float)51.566057,(float) 0.677943),
            new PointF ((float)51.569652,(float) 0.685925),
            new PointF ((float)51.571726,(float) 0.683683),
            new PointF ((float)51.574307,(float) 0.691376),
            new PointF ((float)51.577114,(float) 0.694938),
            new PointF ((float)51.576044,(float) 0.707356),
            new PointF ((float)51.567270,(float) 0.706201),
            new PointF ((float)51.563213,(float) 0.680153),
        };
        private static readonly PointF[] luton = {
            new PointF ((float)51.870667,(float) -0.391338),
            new PointF ((float)51.879059,(float) -0.385480),
            new PointF ((float)51.886893,(float) -0.373131),
            new PointF ((float)51.878098,(float) -0.349388),
            new PointF ((float)51.875091,(float) -0.349131),
        };
        private static readonly PointF[] biggin = {
            new PointF ((float)51.3202129,(float) 0.0290829),
            new PointF ((float)51.3204111,(float) 0.0410469),
            new PointF ((float)51.3403636,(float) 0.0434793),
            new PointF ((float)51.3402232,(float) 0.0310908),
            new PointF ((float)51.3280788,(float) 0.0228554),
        };
        private static readonly PointF[] farnborough = {
            new PointF ((float)51.2890773,(float) -0.7536545),
            new PointF ((float)51.2849666,(float) -0.7786818),
            new PointF ((float)51.2755962,(float) -0.8073436),
            new PointF ((float)51.2658381,(float) -0.7859225),
            new PointF ((float)51.273394,(float) -0.7556678),
        };
        private static readonly PointF[] raf = {
            new PointF ((float)51.5488178,(float) -0.3995989),
            new PointF ((float)51.5624286,(float) -0.4129821),
            new PointF ((float)51.5511199,(float) -0.4387239),
        };

        private static readonly PointF[] ccZone =
        {
            new PointF ((float)51.5152611,(float) -0.0717720),
            new PointF ((float)51.5138916,(float) 0.0064665),
            new PointF ((float)51.5079235,(float) 0.0705975),
            new PointF ((float)51.4991672,(float) 0.0693358),
            new PointF ((float)51.4855420,(float) -0.0107536),
            new PointF ((float)51.5017244,(float) -0.0585566),
            new PointF ((float)51.5060563,(float) -0.0748839),
        };

        private readonly List<PointF[]> airports = new List<PointF[]> { raf, farnborough, biggin, luton, southend, londonCity, stansted, gatwick, heathrow };

        public ReservationService(TaxiServiceContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        public async Task CancelReservation(Guid reservationId, User user)
        {
            var reservation = await context.Reservations.FirstOrDefaultAsync(x => x.Id == reservationId);
            if(reservation == null)
            {
                throw new ArgumentNullException("Cannot find reservation");
            }
            if(reservation.Date.AddHours(-12) < DateTime.Now)
            {
                throw new ArgumentException("You can only cancel reservations 12 hours before.");
            }

            context.ReservationPreferences.RemoveRange(reservation.Preferences);
            context.Reservations.Remove(reservation);
            await context.SaveChangesAsync();
        }

        public async Task<double> GetPrice(ReservationPriceDto reservation)
        {
            if (String.IsNullOrEmpty(reservation.FromAddress))
            {
                throw new ArgumentException("Origin address cannot be empty");
            }
            if (reservation.FromAddress.Length > 150)
            {
                throw new ArgumentException("Origin address too long");
            }

            if (reservation.ReservationType == ReservationType.Oneway)
            {
                if (String.IsNullOrEmpty(reservation.ToAddrress))
                {
                    throw new ArgumentException("Destination address cannot be empty");
                }
                if (reservation.ToAddrress?.Length > 150)
                {
                    throw new ArgumentException("Destination address too long");
                }

                DirectionsRequest directionsRequest = new DirectionsRequest()
                {
                    Origin = reservation.FromAddress,
                    Destination = reservation.ToAddrress,
                    TravelMode = TravelMode.Driving,
                    ApiKey = configuration["Google:MapApiKey"]
                };

                DirectionsResponse directions = await GoogleMaps.Directions.QueryAsync(directionsRequest);
                double execPrice = 0;
                double luxPrice = 0;
                double sevenSeaterPrice = 0;
                if (directions.Status == DirectionsStatusCodes.OK)
                {
                    var startIsInAirport = false;
                    var endIsInAirport = false;

                    foreach (var airport in airports)
                    {
                        if (IsPointInPolygon4(airport, new PointF { Y = (float)directions.Routes.First().Legs.First().EndLocation.Longitude, X = (float)directions.Routes.First().Legs.First().EndLocation.Latitude }))
                        {
                            endIsInAirport = true;
                            break;
                        }
                        if (IsPointInPolygon4(airport, new PointF { Y = (float)directions.Routes.First().Legs.First().StartLocation.Longitude, X = (float)directions.Routes.First().Legs.First().StartLocation.Latitude }))
                        {
                            startIsInAirport = true;
                            break;
                        }
                    }
                    var isInBiggin = IsPointInPolygon4(biggin, new PointF { Y = (float)directions.Routes.First().Legs.First().EndLocation.Longitude, X = (float)directions.Routes.First().Legs.First().EndLocation.Latitude })
                            || IsPointInPolygon4(biggin, new PointF { Y = (float)directions.Routes.First().Legs.First().StartLocation.Longitude, X = (float)directions.Routes.First().Legs.First().StartLocation.Latitude });

                    var isInHeathrow = IsPointInPolygon4(heathrow, new PointF { Y = (float)directions.Routes.First().Legs.First().EndLocation.Longitude, X = (float)directions.Routes.First().Legs.First().EndLocation.Latitude })
                            || IsPointInPolygon4(heathrow, new PointF { Y = (float)directions.Routes.First().Legs.First().StartLocation.Longitude, X = (float)directions.Routes.First().Legs.First().StartLocation.Latitude });

                    if (endIsInAirport || startIsInAirport)
                    {                        
                        var isInside = false;                       

                        isInside = IsPointInPolygon4(ccZone, new PointF { Y = (float)directions.Routes.First().Legs.First().EndLocation.Longitude, X = (float)directions.Routes.First().Legs.First().EndLocation.Latitude })
                                    || IsPointInPolygon4(ccZone, new PointF { Y = (float)directions.Routes.First().Legs.First().StartLocation.Longitude, X = (float)directions.Routes.First().Legs.First().StartLocation.Latitude });

                        var basePriceExec = isInBiggin
                                                ? 95 //form or to biggin hill
                                                : startIsInAirport
                                                    ? 70 // airport to london
                                                    : 65; //london to airport
                        var basePriceLux = isInBiggin
                                                ? 120 //form or to biggin hill
                                                : startIsInAirport
                                                    ? 95 // airport to london
                                                    : 90; //london to airport;
                        var basePriceSevenSeater = isInBiggin
                                                ? 120 //form or to biggin hill
                                                : startIsInAirport
                                                    ? 95 // airport to london
                                                    : 90; //london to airport;

                        if (isInside)
                        {
                            var isEast = ((directions.Routes.First().Legs.First().StartLocation.Longitude - ccDevider[0].X) *
                                (ccDevider[1].Y - ccDevider[0].Y)) -
                                ((directions.Routes.First().Legs.First().StartLocation.Latitude - ccDevider[0].Y) *
                                (ccDevider[1].X - ccDevider[0].X)) >= 0
                                ||
                                ((directions.Routes.First().Legs.First().EndLocation.Longitude - ccDevider[0].X) *
                                (ccDevider[1].Y - ccDevider[0].Y)) -
                                ((directions.Routes.First().Legs.First().EndLocation.Latitude - ccDevider[0].Y) *
                                (ccDevider[1].X - ccDevider[0].X)) >= 0;
                            //Airport with CC fees
                            var distance = directions.Routes.First().Legs.First().Distance.Value * 0.000621371192;
                            //base price (8 miles free) + mile price + CC fee
                            var ccFeeExec = isInHeathrow
                                            ? (isEast
                                                ? 10 //heathrow east side
                                                : 7.5 //heathrow west side
                                            )
                                            : 10; //not heathrow;
                            var ccFeeLux = isInHeathrow
                                            ? (isEast
                                                ? 20 //heathrow east side
                                                : 10 //heathrow west side
                                            )
                                            : 10; //not heathrow;
                            var ccFeeSevenSeater = isInHeathrow
                                            ? (isEast
                                                ? 20 //heathrow east side
                                                : 10 //heathrow west side
                                            )
                                            : 10; //not heathrow;
                            execPrice = Math.Round(
                                basePriceExec //base
                                + (distance - 8 <= 0
                                    ? 0 //within 8 miles
                                    : distance <= 20
                                        ? ((distance - 8) * 1.5) //within 20 miles
                                        : ((distance - 8) * 2)) // over 20 miles
                                + ccFeeExec //CC fee
                                , 2);
                            luxPrice = Math.Round(
                                basePriceLux //base
                                + (distance - 8 <= 0
                                    ? 0 //within 8 miles
                                    : distance <= 20
                                        ? ((distance - 8) * 2) //within 20 miles
                                        : ((distance - 8) * 3)) // over 20 miles
                                + ccFeeLux //CC fee
                                , 2);
                            sevenSeaterPrice = Math.Round(
                                basePriceSevenSeater //base
                                + (distance - 8 <= 0
                                    ? 0 //within 8 miles
                                    : distance <= 20
                                        ? ((distance - 8) * 2) //within 20 miles
                                        : ((distance - 8) * 3)) // over 20 miles
                                + ccFeeSevenSeater //CC fee
                                , 2);
                        }
                        else
                        {
                            //Airport without CC
                            var distance = directions.Routes.First().Legs.First().Distance.Value * 0.000621371192;
                            //base price (8 miles free) + mile price
                            execPrice = Math.Round(
                                basePriceExec //base
                                + (distance - 8 <= 0
                                    ? 0 //within 8 miles
                                    : distance <= 20
                                        ? ((distance - 8) * 1.5) //within 20 miles
                                        : ((distance - 8) * 2)) // over 20 miles
                                , 2);
                            luxPrice = Math.Round(
                                basePriceLux //base
                                + (distance - 8 <= 0
                                    ? 0 //within 8 miles
                                    : distance <= 20
                                        ? ((distance - 8) * 2) //within 20 miles
                                        : ((distance - 8) * 3)) // over 20 miles
                                , 2);
                            sevenSeaterPrice = Math.Round(
                                basePriceSevenSeater //base
                                + (distance - 8 <= 0
                                    ? 0 //within 8 miles
                                    : distance <= 20
                                        ? ((distance - 8) * 2) //within 20 miles
                                        : ((distance - 8) * 3)) // over 20 miles
                                , 2);
                        }
                    }
                    else
                    {
                        //Normal
                        var distance = directions.Routes.First().Legs.First().Distance.Value * 0.000621371192;
                        //base price (5 miles free) + mile price
                        execPrice = Math.Round(
                            50 //base
                            + (distance - 5 <= 0
                                ? 0 //within 5 miles
                                : distance <= 20
                                    ? ((distance - 5) * 3) //within 20 miles
                                    : ((distance - 5) * 2)) // over 20 miles
                            , 2);
                        luxPrice = Math.Round(
                            70 //base
                            + (distance - 5 <= 0
                                ? 0 //within 5 miles
                                : distance <= 20
                                    ? ((distance - 5) * 5) //within 20 miles
                                    : ((distance - 5) * 3)) // over 20 miles
                            , 2);
                        sevenSeaterPrice = Math.Round(
                            70 //base
                            + (distance - 5 <= 0
                                ? 0 //within 5 miles
                                : distance <= 20
                                    ? ((distance - 5) * 5) //within 20 miles
                                    : ((distance - 5) * 3)) // over 20 miles
                            , 2);
                    }
                }
                else
                {
                    throw new ArgumentException("Cant find route");
                }
                return (reservation.CarType == CarType.Executive ? execPrice : reservation.CarType == CarType.Luxury ? luxPrice : sevenSeaterPrice);
            }

            if (reservation.ReservationType == ReservationType.ByTheHour)
            {
                if (reservation.Duration == null)
                    throw new ArgumentException("By the hour rents must specify rent time");
                if (reservation.Duration > 8)
                    throw new ArgumentException("Rent time too long");
                if (reservation.Duration.Value < 3)
                    throw new ArgumentException("Minimum rent time is 3 hours");

                //15 CC fee + hourly rate
                return (reservation.CarType == CarType.Executive
                    ? 15 + reservation.Duration.Value * 35
                    : reservation.CarType == CarType.Luxury
                        ? 15 + reservation.Duration.Value * 48.5
                        : 15 + reservation.Duration.Value * 48.5);
                
            }
            throw new ArgumentException("Invalid Rent type");
        }

        /// <summary>
        /// Determines if the given point is inside the polygon
        /// </summary>
        /// <param name="polygon">the vertices of polygon</param>
        /// <param name="testPoint">the given point</param>
        /// <returns>true if the point is inside the polygon; otherwise, false</returns>
        public static bool IsPointInPolygon4(PointF[] polygon, PointF testPoint)
        {
            bool result = false;
            int j = polygon.Count() - 1;
            for (int i = 0; i < polygon.Count(); i++)
            {
                if (polygon[i].Y < testPoint.Y && polygon[j].Y >= testPoint.Y || polygon[j].Y < testPoint.Y && polygon[i].Y >= testPoint.Y)
                {
                    if (polygon[i].X + (testPoint.Y - polygon[i].Y) / (polygon[j].Y - polygon[i].Y) * (polygon[j].X - polygon[i].X) < testPoint.X)
                    {
                        result = !result;
                    }
                }
                j = i;
            }
            return result;
        }

        public async Task<List<ReservationDetailDto>> GetUserReservations(string userId)
        {
            return await context.Reservations.Include(x => x.Preferences).ThenInclude(y => y.Preference).Where(x => x.ClientId == userId).Select(x =>
                    new ReservationDetailDto {
                        CarType = x.CarType,
                        Comment = x.Comment,
                        Date = x.Date,
                        Duration = x.Duration,
                        FromAddress = x.FromAddress,
                        Preferences = x.Preferences.Select(x => x.Preference.Text).ToList(),
                        Price = x.Price,
                        ReservationType = x.ReservationType,
                        ToAddrress = x.ToAddress
                    }).ToListAsync();
        }

        public async Task MakeReservation(ReservationDto reservation, ApplicationClient user)
        {
            var resPrefs = await context.Preferences.Where(x => reservation.PreferenceIds.Any(y => y == x.Id)).Select(x =>
                                new ReservationPreference
                                {
                                    Preference = x,
                                    PrefId = x.Id,
                                }).ToListAsync();

            var reservationData = new Reservation
            {
                CarType = reservation.CarType,
                Preferences = resPrefs,
                Comment = reservation.Comment,
                Date = DateTime.Parse(reservation.Date),
                Duration = reservation.Duration,
                FromAddress = reservation.FromAddress,
                Price = await GetPrice(new ReservationPriceDto {
                                    ReservationType = reservation.ReservationType,
                                    FromAddress = reservation.FromAddress,
                                    Duration = reservation.Duration,
                                    CarType = reservation.CarType,
                                    PreferenceIds = reservation.PreferenceIds,
                                    ToAddrress = reservation.ToAddrress
                                }),
                ReservationType = reservation.ReservationType,
                ToAddress = reservation.ToAddrress,
                Client = user
            };
            //TODO: Create payment session here
            context.ReservationPreferences.AddRange(resPrefs);
            context.Reservations.Add(reservationData);
            await context.SaveChangesAsync();
        }

        public Task<PagedData<ReservationDetailDto>> SearchReservations(SearchReservationDto searchData)
        {
            throw new NotImplementedException();
        }
    }
}
