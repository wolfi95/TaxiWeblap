using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Enums;

namespace TaxiService.Dto.Reservation
{
    public class ReservationPriceDto
    {
        public string FromAddress { get; set; }
        public string ToAddrress { get; set; }
        public int? Duration { get; set; }
        public ReservationType ReservationType { get; set; }
        public CarType CarType { get; set; }
        public List<Guid> PreferenceIds { get; set; }
    }
}
