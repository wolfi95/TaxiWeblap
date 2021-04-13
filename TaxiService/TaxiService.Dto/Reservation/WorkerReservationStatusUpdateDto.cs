using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Enums;

namespace TaxiService.Dto.Reservation
{
    public class WorkerReservationStatusUpdateDto
    {
        public WorkerReservationStatus Status { get; set; }
        public DateTime? ArriveTime { get; set; }
    }
}
