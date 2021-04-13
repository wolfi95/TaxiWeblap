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

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("api/worker")]
    [Authorize(UserRoles.Worker)]
    public class WorkerController : ControllerBase
    {
        private readonly IWorkerService workerService;
        private readonly UserManager<User> userManager;

        public WorkerController(IWorkerService workerService, UserManager<User> userManager)
        {
            this.workerService = workerService;
            this.userManager = userManager;
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
    }
}
