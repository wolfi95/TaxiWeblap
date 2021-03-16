using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Enums;

namespace TaxiService.Dto.Reservation
{
    public class ReservationDto
    {
        public string FromAddress { get; set; }
        public string ToAddrress { get; set; }
        public int? Duration { get; set; }
        public ReservationType ReservationType { get; set; }
        public string Date { get; set; }
        public CarType CarType { get; set; } 
        public List<int> PreferenceIds { get; set; }
        public string Comment { get; set; }
        public string DiscountCode { get; set; }
    }
}
