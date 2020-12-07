using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.Utils;

namespace TaxiService.Bll.Services
{
    public class ReservationService : IReservationService
    {
        private readonly TaxiServiceContext context;

        public ReservationService(TaxiServiceContext context)
        {
            this.context = context;
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

            var resPrefs = context.ReservationPreferences.Where(x => reservation.Preferences.Any(y => y.Id == x.PrefId));

            context.ReservationPreferences.RemoveRange(resPrefs);
            context.Reservations.Remove(reservation);
            await context.SaveChangesAsync();
        }

        public Task<double> GetPrice(ReservationPriceDto reservation)
        {
            throw new NotImplementedException();
        }

        public Task<ReservationDetailDto> GetUserReservations(string userId)
        {
            throw new NotImplementedException();
        }

        public Task MakeReservation(ReservationDto reservation)
        {
            throw new NotImplementedException();
        }

        public Task<PagedData<ReservationDetailDto>> SearchReservations(SearchReservationDto searchData)
        {
            throw new NotImplementedException();
        }
    }
}
