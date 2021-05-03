using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Dto.User;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IAdminService
    {
        public Task AssignWorkerToReservation(string workerId, Guid reservationId);
        public Task<IEnumerable<WorkerDto>> GetAllWorkersAsync();
    }
}
