using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Entities.Modles;

namespace TaxiService.Dal.Entities.Models
{
    public class WorkItem
    {
        public Guid Id { get; set; }
        public double Hours { get; set; }
        public double Distance { get; set; }
        public DateTime Date { get; set; }
        public Reservation Reservation { get; set; }
        public Guid ReservationId { get; set; }
        public Worker Worker { get; set; }
        public string WorkerId { get; set; }
        public string Comment { get; set; }
    }
}
