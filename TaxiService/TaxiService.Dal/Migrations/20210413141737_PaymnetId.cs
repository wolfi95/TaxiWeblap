using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TaxiService.Dal.Migrations
{
    public partial class PaymnetId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PaymentId",
                table: "Reservations",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "Reservations");
        }
    }
}
