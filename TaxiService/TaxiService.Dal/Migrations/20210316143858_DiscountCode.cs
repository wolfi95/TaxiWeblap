using Microsoft.EntityFrameworkCore.Migrations;

namespace TaxiService.Dal.Migrations
{
    public partial class DiscountCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Discount_DiscountId",
                table: "Reservations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Discount",
                table: "Discount");

            migrationBuilder.RenameTable(
                name: "Discount",
                newName: "Discounts");

            migrationBuilder.AlterColumn<string>(
                name: "Identifier",
                table: "Reservations",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiscountCode",
                table: "Discounts",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Discounts",
                table: "Discounts",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Discounts_DiscountCode",
                table: "Discounts",
                column: "DiscountCode",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Discounts_DiscountId",
                table: "Reservations",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Discounts_DiscountId",
                table: "Reservations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Discounts",
                table: "Discounts");

            migrationBuilder.DropIndex(
                name: "IX_Discounts_DiscountCode",
                table: "Discounts");

            migrationBuilder.DropColumn(
                name: "DiscountCode",
                table: "Discounts");

            migrationBuilder.RenameTable(
                name: "Discounts",
                newName: "Discount");

            migrationBuilder.AlterColumn<int>(
                name: "Identifier",
                table: "Reservations",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Discount",
                table: "Discount",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Discount_DiscountId",
                table: "Reservations",
                column: "DiscountId",
                principalTable: "Discount",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
