using System;
using System.Collections.Generic;
using System.Text;
using TaxiService.Dal.Enums;

namespace TaxiService.Dto.Reservation
{
    public class SearchReservationDto
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        public List<int> PrefIds { get; set; }
        public ReservationType? ReservationType { get; set; }
        public CarType? CarType { get; set; }
        public ReservationStatus? Status { get; set; }
    }
}
