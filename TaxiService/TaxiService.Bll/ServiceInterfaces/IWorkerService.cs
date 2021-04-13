using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Dal.Enums;
using TaxiService.Dto.Reservation;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IWorkerService
    {
        public Task UpdateReservationStatus(string workerId, Guid reservationId, WorkerReservationStatusUpdateDto status);
    }
}
