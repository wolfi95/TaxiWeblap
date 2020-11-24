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
        public async Task<double> GetReservationPrice([FromBody] ReservationDto reservation)
        {
            ValidateReservation(reservation);

            return await reservationService.GetPrice(reservation);
        }

        [HttpPost]
        [Route("make")]
        public async Task MakeReservation([FromBody] ReservationDto reservation)
        {
            ValidateReservation(reservation);

            await reservationService.MakeReservation(reservation);
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
            if (String.IsNullOrEmpty(reservation.ToAddrress))
            {
                throw new ArgumentNullException("Destination address cannot be empty.");
            }
            if(reservation.Date < DateTime.Now.AddMinutes(-10))
            {
                throw new ArgumentException("Reservation time cannot be a past date.");
            }
            if(reservation.ReservationType == Dal.Enums.ReservationType.ByTheHour && (reservation.Duration == null || (reservation.Duration < 0 || reservation.Duration > 12)))
            {
                throw new ArgumentException("Reservation duration out of bounds.");
            }            
        }
    }
}
