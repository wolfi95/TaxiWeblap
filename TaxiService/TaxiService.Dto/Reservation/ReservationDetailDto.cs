using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Enums;

namespace TaxiService.Dto.Reservation
{
    public class ReservationDetailDto
    {
        public string FromAddress { get; set; }
        public string ToAddrress { get; set; }
        public int? Duration { get; set; }
        public ReservationType ReservationType { get; set; }
        public DateTime Date { get; set; }
        public CarType CarType { get; set; }
        public List<string> Preferences { get; set; }
        public string Comment { get; set; }
        public double Price { get; set; }
        public Guid Id { get; set; }
        public string Identifier { get; set; }
        public ReservationStatus Status { get; set; }
    }
}
