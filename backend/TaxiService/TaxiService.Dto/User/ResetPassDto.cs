using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dto.User
{
    public class ResetPassDto
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string NewPasswordConfirm { get; set; }
    }
}
