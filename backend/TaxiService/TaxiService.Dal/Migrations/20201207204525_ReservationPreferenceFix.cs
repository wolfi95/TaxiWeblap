using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TaxiService.Dal.Migrations
{
    public partial class ReservationPreferenceFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Preferences_Reservations_ReservationId",
                table: "Preferences");

            migrationBuilder.DropIndex(
                name: "IX_Preferences_ReservationId",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "ReservationId",
                table: "Preferences");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReservationId",
                table: "Preferences",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Preferences_ReservationId",
                table: "Preferences",
                column: "ReservationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Preferences_Reservations_ReservationId",
                table: "Preferences",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
