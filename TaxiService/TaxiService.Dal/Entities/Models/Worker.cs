using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Modles;
using TaxiService.Dal.Enums;

namespace TaxiService.Dal.Entities.Models
{
    public class Worker : User
    {
        public CarType Car { get; set; }
        public bool Active { get; set; }
        public List<WorkerPreference> WorkerPreferences { get; set; }
        public List<WorkItem> WorkItems { get; set; }
        public List<Reservation> Reservations { get; set; }
    }
}
