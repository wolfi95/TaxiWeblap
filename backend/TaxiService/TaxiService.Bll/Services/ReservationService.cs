using System;
using System.Collections.Generic;
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

        public Task CancelReservation(Guid reservationId, User user)
        {
            throw new NotImplementedException();
        }

        public Task<double> GetPrice(ReservationDto reservation)
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
