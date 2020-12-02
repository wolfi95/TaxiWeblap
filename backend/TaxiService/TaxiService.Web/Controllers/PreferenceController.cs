using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Web.Controllers
{
    [ApiController]
    [Route("preferences")]
    public class PreferenceController : Controller
    {
        [HttpGet]
        public Task<List<Preference>> GetAllPreferences()
        {
            throw new NotImplementedException();
        }
    }
}
