﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;

namespace TaxiService.Bll.Services
{
    public class AdminService : IAdminService
    {
        private readonly TaxiServiceContext context;

        public AdminService(TaxiServiceContext context)
        {
            this.context = context;
        }
        public async Task AssignWorkerToReservation(string workerId, Guid reservationId)
        {
            var worker = await context.Workers.FirstOrDefaultAsync(x => x.Id == workerId);
            if(worker == null)
            {
                throw new ArgumentNullException("Cannot find worker with this Id: " + workerId);
            }

            var reservation = await context.Reservations.FirstOrDefaultAsync(x => x.Id == reservationId);
            if(reservation == null)
            {
                throw new ArgumentNullException("Cannot find reservation");
            }

            reservation.Worker = worker;
            reservation.WorkerId = workerId;
            reservation.Status = Dal.Enums.ReservationStatus.Assigned;

            await context.SaveChangesAsync();

        }
    }
}