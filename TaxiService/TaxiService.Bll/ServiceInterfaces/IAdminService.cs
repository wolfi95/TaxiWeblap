using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IAdminService
    {
        public Task AssignWorkerToReservation(string workerId, Guid reservationId);
    }
}
