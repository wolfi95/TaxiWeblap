using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Entities.Models;
using TaxiService.Dal.Enums;

namespace TaxiService.Dal.Entities.Modles
{
    public class Reservation
    {
        public Guid Id { get; set; }
        public int? Identifier { get; set; }
        public ApplicationClient Client { get; set; }
        public string ClientId { get; set; }
        public ReservationType ReservationType { get; set; }
        public CarType CarType { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public double Price { get; set; }
        public int? Duration { get; set; }
        public DateTime Date { get; set; }
        public List<ReservationPreference> Preferences { get; set; }
        public string Comment { get; set; }
        public Discount Discount { get; set; }
        public Guid DiscountId { get; set; }

        public DateTime ArriveTime { get; set; }
        public Worker Worker { get; set; }
        public string WorkerId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime EditedDate { get; set; }
        public ReservationStatus Status { get; set; }
    }
}
