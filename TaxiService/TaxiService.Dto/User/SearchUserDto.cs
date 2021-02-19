using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dto.User
{
    public class SearchUserDto
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string UserName { get; set; }
        public string UserAddress { get; set; }
    }
}
