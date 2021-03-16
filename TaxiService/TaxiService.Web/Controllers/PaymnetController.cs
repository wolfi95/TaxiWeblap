using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal.Entities.Authentication;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymnetController : Controller
    {
        private readonly IPaymentService paymnetService;
        private readonly UserManager<User> userManager;

        public PaymnetController(IPaymentService paymnetService, UserManager<User> userManager)
        {
            this.paymnetService = paymnetService;
            this.userManager = userManager;
        }

        [HttpGet]        
        [Authorize]
        [Route("{reservationId}/barion")]
        public async Task<string> PayWithBarion([FromRoute] Guid reservationId)
        {
            var user = await userManager.GetUserAsync(User);
            if(user == null)
            {
                throw new ArgumentException("Cannot find user.");
            }

            return await paymnetService.StartBarionPayment(reservationId, user.Id);
        }

        [HttpPost]
        [Route("barionCallback")]
        public async Task<IActionResult> BarionCallback([FromQuery(Name = "paymentId")] Guid paymentId)
        {
            try
            {
                await paymnetService.UpdatePaymentStatus(paymentId);
            }
            catch
            {
                return new BadRequestResult();
            }
            return new OkResult();
        }
    }
}
