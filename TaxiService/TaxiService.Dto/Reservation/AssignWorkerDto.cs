using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dto.Reservation
{
    public class AssignWorkerDto
    {
        public string WorkerId { get; set; }
        public Guid ReservationId { get; set; }
    }
}
