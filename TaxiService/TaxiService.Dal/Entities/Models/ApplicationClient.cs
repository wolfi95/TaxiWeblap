using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Dal.Entities.Models
{
    public class ApplicationClient: User
    {
        public bool AllowNotifications { get; set; }
        public bool AllowNews { get; set; }
        public List<Reservation> Reservations { get; set; }
    }
}
