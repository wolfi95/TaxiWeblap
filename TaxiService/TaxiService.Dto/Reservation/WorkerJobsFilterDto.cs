using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dto.Reservation
{
    public class WorkerJobsFilterDto
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public bool HideComplete { get; set; }
    }
}
