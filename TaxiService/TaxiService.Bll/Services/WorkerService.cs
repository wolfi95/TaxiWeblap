using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;
using TaxiService.Dal.Enums;
using TaxiService.Dto.Reservation;

namespace TaxiService.Bll.Services
{
    public class WorkerService : IWorkerService
    {
        private readonly TaxiServiceContext context;

        public WorkerService(TaxiServiceContext context)
        {
            this.context = context;
        }
        public async Task UpdateReservationStatus(string workerId, Guid reservationId, WorkerReservationStatusUpdateDto status)
        {
            var worker = await context.Workers.FirstOrDefaultAsync(x => x.Id == workerId);
            if(worker == null)
            {
                throw new ArgumentNullException("Cannot find worker");
            }

            var reservation = await context.Reservations.FirstOrDefaultAsync(x => x.Id == reservationId && x.WorkerId == workerId);
            if(reservation == null)
            {
                throw new ArgumentException("Cannot find reservation");
            }

            reservation.Status = (ReservationStatus) status.Status;

            reservation.ArriveTime = status.ArriveTime;

            await context.SaveChangesAsync();
        }
    }
}
