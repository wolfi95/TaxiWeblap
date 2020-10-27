using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dal.Entities.Authentication
{
    public class User : IdentityUser
    {
        public string Address { get; set; }
        public bool AllowNotifications { get; set; }
        public bool AllowNews { get; set; }
    }
}
