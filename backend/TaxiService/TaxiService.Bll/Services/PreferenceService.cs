using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Bll.Services
{
    public class PreferenceService : IPreferenceService
    {
        private readonly TaxiServiceContext context;

        public PreferenceService(TaxiServiceContext context)
        {
            this.context = context;
        }
        public async Task<List<Preference>> GetAllPreferences()
        {
            return await context.Preferences.ToListAsync();
        }
    }
}
