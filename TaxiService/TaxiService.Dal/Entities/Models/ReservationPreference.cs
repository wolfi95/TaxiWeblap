using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dal.Entities.Modles
{
    public class ReservationPreference
    {
        public Guid Id { get; set; }
        public Preference Preference { get; set; }
        public int PrefId { get; set; }
        public Reservation Reservation { get; set; }
        public Guid ReservationId { get; set; }
    }
}
