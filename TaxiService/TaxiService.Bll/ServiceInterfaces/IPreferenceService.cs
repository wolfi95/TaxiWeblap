using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IPreferenceService
    {
        public Task<List<Preference>> GetAllPreferences();
    }
}
