using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dal.Entities.Models
{
    public class Discount
    {
        public Guid Id { get; set; }
        public double? DiscountAmount { get; set; }
        public double? DiscountPercent { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
