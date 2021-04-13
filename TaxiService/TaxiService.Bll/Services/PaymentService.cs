using BarionClientLibrary;
using BarionClientLibrary.Operations.Common;
using BarionClientLibrary.Operations.PaymentState;
using BarionClientLibrary.Operations.Refund;
using BarionClientLibrary.Operations.StartPayment;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaxiService.Bll.ServiceInterfaces;
using TaxiService.Dal;

namespace TaxiService.Bll.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly TaxiServiceContext context;
        private readonly BarionClient barionClient;
        private readonly BarionSettings barionSettings;
        private readonly IConfiguration configuration;

        public PaymentService(TaxiServiceContext context, BarionClient barionClient, BarionSettings barionSettings, IConfiguration configuration)
        {
            this.context = context;
            this.barionClient = barionClient;
            this.barionSettings = barionSettings;
            this.configuration = configuration;
        }
        public async Task<string> StartBarionPayment(Guid reservationId, string userId)
        {
            var reservation = await context.Reservations.FirstOrDefaultAsync(r => r.Id == reservationId && r.ClientId == userId);

            if(reservation == null)
            {
                throw new ArgumentException("Cannot find reservation.");
            }

            var item = new Item
            {
                Description = "Taxi Service Trip",
                ItemTotal = Convert.ToDecimal(Math.Round(reservation.Price,0)),
                Unit= "trip",
                Name = "TaxiService Payment Invoice",
                Quantity = 1,
                UnitPrice = Convert.ToDecimal(Math.Round(reservation.Price,0)),
            };

            var transaction = new PaymentTransaction
            {
                Items = new[] { item },
                POSTransactionId = reservation.Identifier,
                Payee = barionSettings.Payee,
                Total = Convert.ToDecimal(Math.Round(reservation.Price,0)),
            };

            var startPayment = new StartPaymentOperation
            {
                Transactions = new[] { transaction },
                PaymentType = PaymentType.Immediate,
                Currency = Currency.HUF,
                FundingSources = new[] { FundingSourceType.All },
                GuestCheckOut = true,
                Locale = CultureInfo.CurrentCulture,
                OrderNumber = reservation.Identifier,
                PaymentRequestId = reservation.Id.ToString(),
                CallbackUrl = configuration["Barion:CallbackUrl"],
                RedirectUrl = configuration["Barion:RedirectUrl"],
            };

            var result = await barionClient.ExecuteAsync(startPayment);

            if (result.IsOperationSuccessful)
            {
                var startPaymentReult = result as StartPaymentOperationResult;
                return startPaymentReult.GatewayUrl;
            }
            else
            {
                throw new Exception("Barion couldnt start your payment process. Please try again later, or contact support.");
            }
        }

        public async Task RefundBarionPayment(Guid reservationId, string userId)
        {
            var reservation = await context.Reservations.FirstOrDefaultAsync(x => x.Id == reservationId && x.ClientId == userId);
            if (reservation == null)
            {
                throw new ArgumentNullException("Cannot find reservation");
            }
            if(reservation.PaymentId == null)
            {
                throw new ArgumentNullException("Unpaid reservation cannot be refunded.");
            }

            var checkStatusOperation = new GetPaymentStateOperation
            {
                PaymentId = reservation.PaymentId.Value
            };

            var result = await barionClient.ExecuteAsync(checkStatusOperation);

            if (result.IsOperationSuccessful)
            {
                var paymentState = result as GetPaymentStateOperationResult;
                if(paymentState.Status != PaymentStatus.Succeeded)
                {
                    throw new ArgumentException("Only completed payments can be refunded");
                }

                var transactionsToRefund = new TransactionToRefund[paymentState.Transactions.Length];
                foreach (var tr in paymentState.Transactions) {
                    transactionsToRefund.Append(
                        new TransactionToRefund
                        {
                            AmountToRefund = tr.Total,
                            POSTransactionId = tr.POSTransactionId,
                            TransactionId = tr.TransactionId
                        }
                    );
                }

                var startRefund = new RefundOperation
                {
                    PaymentId = reservation.PaymentId.Value,
                    TransactionsToRefund = transactionsToRefund
                };
                var refundResult = await barionClient.ExecuteAsync(startRefund);

                if (refundResult.IsOperationSuccessful)
                {
                    reservation.Status = Dal.Enums.ReservationStatus.Refunded;
                    await context.SaveChangesAsync();
                }
                else
                {
                    throw new ArgumentException("Communication failed with Barion please try again later.");
                }
            }
            else
            {
                throw new ArgumentException("Communication failed with Barion please try again later.");
            }
        }

        public async Task UpdatePaymentStatus(Guid paymentId)
        {
            var checkStatusOperation = new GetPaymentStateOperation
            {
                PaymentId = paymentId
            };

            var result = await barionClient.ExecuteAsync(checkStatusOperation);

            if (result.IsOperationSuccessful)
            {
                var paymentState = result as GetPaymentStateOperationResult;

                switch (paymentState.Status)
                {
                    case PaymentStatus.Succeeded:
                        {
                            var reservation = await context.Reservations.FirstOrDefaultAsync(r => r.Id == Guid.Parse(paymentState.PaymentRequestId));
                            if(reservation == null)
                            {
                                throw new ArgumentException("Could not find reservation: " + paymentState.PaymentRequestId);
                            }

                            reservation.Status = Dal.Enums.ReservationStatus.Payed;
                            reservation.PaymentId = paymentId;
                            await context.SaveChangesAsync();

                            break;
                        }
                }
            }
            else
            {
                throw new ArgumentException("Couldn't retrive payment status");
            }
        }
    }
}
