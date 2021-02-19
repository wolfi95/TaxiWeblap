using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.Utils;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("reservation")]
    [Authorize]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService reservationService;
        private readonly UserManager<User> userManager;

        public ReservationController(IReservationService reservationService, UserManager<User> userManager)
        {
            this.reservationService = reservationService;
            this.userManager = userManager;
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Administrator)]
        public async Task<PagedData<ReservationDetailDto>> SearchReservations([FromBody] SearchReservationDto searchData)
        {
            return await reservationService.SearchReservations(searchData);
        }

        [HttpPost]
        [Route("price")]
        public async Task<double> GetReservationPrice([FromBody] ReservationPriceDto reservation)
        {
            if (String.IsNullOrEmpty(reservation.FromAddress))
            {
                throw new ArgumentNullException("From address cannot be empty.");
            }
            if (reservation.Duration == null && String.IsNullOrEmpty(reservation.ToAddrress))
            {
                throw new ArgumentNullException("Destination address cannot be empty.");
            }
            if (reservation.ReservationType == Dal.Enums.ReservationType.ByTheHour && (reservation.Duration == null || (reservation.Duration < 0 || reservation.Duration > 12)))
            {
                throw new ArgumentException("Reservation duration out of bounds.");
            }

            return await reservationService.GetPrice(reservation);
        }

        [HttpPost]
        [Route("make")]
        public async Task MakeReservation([FromBody] ReservationDto reservation)
        {
            ValidateReservation(reservation);

            await reservationService.MakeReservation(reservation, await userManager.GetUserAsync(User));
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task CancelReservation([FromRoute] Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentNullException("Reservation identifier cannot be empty.");
            }

            await reservationService.CancelReservation(id, await userManager.GetUserAsync(User));
        }

        private void ValidateReservation(ReservationDto reservation)
        {
            if (String.IsNullOrEmpty(reservation.FromAddress))
            {
                throw new ArgumentNullException("From address cannot be empty.");
            }
            if (reservation.Duration == null && String.IsNullOrEmpty(reservation.ToAddrress))
            {
                throw new ArgumentNullException("Destination address cannot be empty.");
            }
            if (DateTime.Parse(reservation.Date) < DateTime.Now.AddHours(-12))
            {
                throw new ArgumentException("Reservation time must be in 12 hours advance.");
            }
            if (reservation.ReservationType == Dal.Enums.ReservationType.ByTheHour && (reservation.Duration == null || (reservation.Duration < 0 || reservation.Duration > 12)))
            {
                throw new ArgumentException("Reservation duration out of bounds.");
            }            
        }
    }
}
