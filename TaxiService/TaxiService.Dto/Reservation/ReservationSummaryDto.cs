using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Models;
using TaxiService.Dal.Entities.Modles;
using TaxiService.Dal.Enums;

namespace TaxiService.Dto.Reservation
{
    public class ReservationSummaryDto
    {
        public string Identifier { get; set; }
        public ReservationType ReservationType { get; set; }
        public CarType CarType { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public double Price { get; set; }
        public int? Duration { get; set; }
        public DateTime Date { get; set; }
        public List<string> Preferences { get; set; }
        public string Comment { get; set; }
        public string DiscountCode { get; set; }

        public DateTime? ArriveTime { get; set; }
        public string AssignedDriver{ get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? EditedDate { get; set; }
        public ReservationStatus Status { get; set; }
    }
}
