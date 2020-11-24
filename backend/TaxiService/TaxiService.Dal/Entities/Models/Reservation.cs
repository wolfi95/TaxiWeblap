using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Authentication;
using TaxiService.Dal.Enums;

namespace TaxiService.Dal.Entities.Modles
{
    public class Reservation
    {
        public Guid Id { get; set; }
        public int? Identifier { get; set; }
        public User? User{ get; set; }
        public ReservationType ReservationType { get; set; }
        public CarType CarType { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public double Price { get; set; }
        public int? Duration { get; set; }
        public DateTime Date { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public List<Preference> Preferences { get; set; }
        public string Comment { get; set; }
    }
}
