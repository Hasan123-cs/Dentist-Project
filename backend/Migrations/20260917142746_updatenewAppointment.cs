using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dentist_project.Migrations
{
    /// <inheritdoc />
    public partial class updatenewAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AmountPaid",
                table: "Appointments",
                newName: "RemainingAmount");

            migrationBuilder.AddColumn<decimal>(
                name: "PaidAmount",
                table: "Appointments",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaidAmount",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "RemainingAmount",
                table: "Appointments",
                newName: "AmountPaid");
        }
    }
}
