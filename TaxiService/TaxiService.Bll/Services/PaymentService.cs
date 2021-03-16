﻿using BarionClientLibrary;
using BarionClientLibrary.Operations.Common;
using BarionClientLibrary.Operations.PaymentState;
using BarionClientLibrary.Operations.StartPayment;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
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

        public PaymentService(TaxiServiceContext context, BarionClient barionClient, BarionSettings barionSettings)
        {
            this.context = context;
            this.barionClient = barionClient;
            this.barionSettings = barionSettings;
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
                POSTransactionId = "T1",
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
                CallbackUrl = "https://localhost:5001/payment/barionCallback",
                RedirectUrl = "https://localhost:5001/#/successfulPayment",
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
