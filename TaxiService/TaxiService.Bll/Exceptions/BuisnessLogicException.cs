using System;
using System.Collections.Generic;
using System.Text;

namespace TaxiService.Bll.Exceptions
{
    public class BuisnessLogicException : Exception
    {
        public BuisnessLogicException(string message) : base(message)
        {

        }
    }
}
