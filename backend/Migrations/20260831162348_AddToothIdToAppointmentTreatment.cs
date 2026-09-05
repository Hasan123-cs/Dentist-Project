using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dentist_project.Migrations
{
    /// <inheritdoc />
    public partial class AddToothIdToAppointmentTreatment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ToothId",
                table: "AppointmentTreatments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentTreatments_ToothId",
                table: "AppointmentTreatments",
                column: "ToothId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentTreatments_Teeth_ToothId",
                table: "AppointmentTreatments",
                column: "ToothId",
                principalTable: "Teeth",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentTreatments_Teeth_ToothId",
                table: "AppointmentTreatments");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentTreatments_ToothId",
                table: "AppointmentTreatments");

            migrationBuilder.DropColumn(
                name: "ToothId",
                table: "AppointmentTreatments");
        }
    }
}
