using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Models;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.Utils;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IReservationService
    {
        public Task<double> GetPrice(ReservationPriceDto reservation);
        public Task MakeReservation(ReservationDto reservation, ApplicationClient user);
        public Task<List<ReservationDetailDto>> GetUserReservations(string userId);
        public Task CancelReservation(Guid reservationId, User user);
        public Task<PagedData<ReservationDetailDto>> SearchReservations(SearchReservationDto searchData);
    }
}
