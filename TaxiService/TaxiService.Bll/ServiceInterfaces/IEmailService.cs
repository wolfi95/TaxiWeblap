using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IEmailService
    {
        public void SendMail(string toEmail, string subject, string message);
    }
}
