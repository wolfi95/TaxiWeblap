using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Enums;
using TaxiService.Dto.Reservation;
using TaxiService.Dto.Utils;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("api/worker")]
    [Authorize(Roles = UserRoles.Worker)]
    public class WorkerController : ControllerBase
    {
        private readonly IWorkerService workerService;
        private readonly UserManager<User> userManager;
        private readonly IReservationService reservationService;

        public WorkerController(IWorkerService workerService, UserManager<User> userManager, IReservationService reservationService)
        {
            this.workerService = workerService;
            this.userManager = userManager;
            this.reservationService = reservationService;
        }

        [HttpPost]
        [Route("jobs/{resId}/update")]
        public async Task<IActionResult> UpdateJobStatus([FromBody] WorkerReservationStatusUpdateDto status, [FromRoute] Guid resId)
        {
            var user = await userManager.GetUserAsync(User);
            if(user == null)
            {
                throw new ArgumentException("Cannot find user");
            }

            await workerService.UpdateReservationStatus(user.Id, resId, status);
            return Ok();
        }

        [HttpPost("jobs")]
        public async Task<PagedData<ReservationDetailDto>> GetCurrentJobs([FromBody] PagerDto pager)
        {
            var user = await userManager.GetUserAsync(User);
            return await reservationService.GetWorkerReservations(user.Id, pager);
        }
    }
}
