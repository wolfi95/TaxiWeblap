using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TaxiService.Dal.Migrations
{
    public partial class DiscountCodeOptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Discounts_DiscountId",
                table: "Reservations");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EditedDate",
                table: "Reservations",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<Guid>(
                name: "DiscountId",
                table: "Reservations",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Discounts_DiscountId",
                table: "Reservations",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Discounts_DiscountId",
                table: "Reservations");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EditedDate",
                table: "Reservations",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DiscountId",
                table: "Reservations",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Discounts_DiscountId",
                table: "Reservations",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
