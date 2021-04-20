using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;

namespace TaxiService.Bll.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;
        private readonly IWebHostEnvironment webHostEnvironment;

        public EmailService(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            this.configuration = configuration;
            this.webHostEnvironment = webHostEnvironment;
        }
            
        public void SendMail(string toEmail, string subject, string message)
        {
            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(Environment.GetEnvironmentVariable("BOOKING_EMAIL") ?? configuration["EmailService:User"], Environment.GetEnvironmentVariable("BOOKING_PASS") ?? configuration["EmailService:Password"]),
                Timeout = 20000,
            };

            var builder = new BodyBuilder();

            using (StreamReader SourceReader = System.IO.File.OpenText(webHostEnvironment.WebRootPath + Path.DirectorySeparatorChar.ToString() + "Templates" + Path.DirectorySeparatorChar.ToString() + "EmailTemplatePage.html"))
            {
                builder.HtmlBody = SourceReader.ReadToEnd();
            }
            //{0} : Message

            string messageBody = string.Format(builder.HtmlBody, message);

            using (var email = new MailMessage(new MailAddress(Environment.GetEnvironmentVariable("BOOKING_EMAIL") ?? configuration["EmailService:User"]), new MailAddress(toEmail))
            {
                Subject = subject,
                Body = messageBody
            })
            {
                email.IsBodyHtml = true;
                smtp.Send(email);
            }
        }
    }
}
