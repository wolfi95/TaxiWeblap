using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.User;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = UserRoles.Administrator)]
    public class AdminController : Controller
    {
        private readonly IAdminService adminService;

        public AdminController(IAdminService adminService)
        {
            this.adminService = adminService;
        }

        [HttpPost]
        [Route("assign")]
        public async Task<IActionResult> AssignWorkerToReservation([FromBody] AssignWorkerDto assignWorkerDto)
        {
            await adminService.AssignWorkerToReservation(assignWorkerDto.WorkerId, assignWorkerDto.ReservationId);
            return Ok();
        }

        [HttpGet("workers")]
        public async Task<IEnumerable<WorkerDto>> GetAllWorkers()
        {
            return await adminService.GetAllWorkersAsync();
        }
    }
}
