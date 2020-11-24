using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dto.User
{
    public class UserDataResponse
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
    }
}
