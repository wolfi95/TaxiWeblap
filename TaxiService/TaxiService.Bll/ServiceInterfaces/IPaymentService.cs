using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TaxiService.Bll.ServiceInterfaces
{
    public interface IPaymentService
    {
        public Task<string> StartBarionPayment(Guid reservationId, string userId);
        public Task UpdatePaymentStatus(Guid paymentId);
        public Task RefundBarionPayment(Guid reservationId, string userId);
    }
}
