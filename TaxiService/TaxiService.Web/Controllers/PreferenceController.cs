using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("api/preferences")]
    public class PreferenceController : Controller
    {
        private readonly IPreferenceService preferenceService;

        public PreferenceController(IPreferenceService preferenceService)
        {
            this.preferenceService = preferenceService;
        }
        [HttpGet]
        public async Task<List<Preference>> GetAllPreferences()
        {
            return await this.preferenceService.GetAllPreferences();
        }
    }
}
