using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TaxiService.Dal.Migrations
{
    public partial class ReservationPreferencePrefIdFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PrefId",
                table: "ReservationPreferences",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "PrefId",
                table: "ReservationPreferences",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(int));
        }
    }
}
