﻿using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Dto.User
{
    public class UserRegisterDto
    {
        public string Email { get; set; }   
        public string Password { get; set; }
        public string EmailRe { get; set; }
        public string PasswordRe { get; set; }
        public string Name { get; set; }
        public bool AllowSpam { get; set; }
    }
}
