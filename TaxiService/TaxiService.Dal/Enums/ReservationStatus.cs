using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dal.Enums
{
    public enum ReservationStatus
    {
        Reserved,
        Payed,
        Assigned,
        OnTheWay,
        Arrived,
        Canceled,
        Refunded
    }
}
