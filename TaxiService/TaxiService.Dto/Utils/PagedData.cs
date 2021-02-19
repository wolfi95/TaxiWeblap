using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dto.Utils
{
    public class PagedData<T>
    {
        public List<T> Data { get; set; }
        public int ResultCount { get; set; }
    }
}
