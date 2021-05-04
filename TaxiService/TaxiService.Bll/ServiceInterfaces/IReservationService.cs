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
        public Task<Guid> MakeReservation(ReservationDto reservation, string userId);
        public Task<List<ReservationDetailDto>> GetUserReservations(string userId);
        public Task CancelReservation(Guid reservationId, User user);
        public Task<PagedData<ReservationDetailDto>> SearchReservations(SearchReservationDto searchData);
        public Task<ReservationSummaryDto> GetReservationDetails(Guid reservationId, string userId);
        public Task<PagedData<ReservationDetailDto>> GetWorkerReservations(string workerId, PagerDto pager);
    }
}
