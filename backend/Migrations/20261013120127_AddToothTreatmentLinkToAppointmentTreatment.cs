using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dentist_project.Migrations
{
    /// <inheritdoc />
    public partial class AddToothTreatmentLinkToAppointmentTreatment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ToothTreatmentId",
                table: "AppointmentTreatments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentTreatments_ToothTreatmentId",
                table: "AppointmentTreatments",
                column: "ToothTreatmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentTreatments_ToothTreatments_ToothTreatmentId",
                table: "AppointmentTreatments",
                column: "ToothTreatmentId",
                principalTable: "ToothTreatments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentTreatments_ToothTreatments_ToothTreatmentId",
                table: "AppointmentTreatments");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentTreatments_ToothTreatmentId",
                table: "AppointmentTreatments");

            migrationBuilder.DropColumn(
                name: "ToothTreatmentId",
                table: "AppointmentTreatments");
        }
    }
}
