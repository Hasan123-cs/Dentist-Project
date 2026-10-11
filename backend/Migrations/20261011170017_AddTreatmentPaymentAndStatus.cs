using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dentist_project.Migrations
{
    /// <inheritdoc />
    public partial class AddTreatmentPaymentAndStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppointmentTreatmentId",
                table: "ToothTreatments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "AppointmentTreatments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PaidAmount",
                table: "AppointmentTreatments",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "AppointmentTreatments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ToothTreatments_AppointmentTreatmentId",
                table: "ToothTreatments",
                column: "AppointmentTreatmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToothTreatments_AppointmentTreatments_AppointmentTreatmentId",
                table: "ToothTreatments",
                column: "AppointmentTreatmentId",
                principalTable: "AppointmentTreatments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToothTreatments_AppointmentTreatments_AppointmentTreatmentId",
                table: "ToothTreatments");

            migrationBuilder.DropIndex(
                name: "IX_ToothTreatments_AppointmentTreatmentId",
                table: "ToothTreatments");

            migrationBuilder.DropColumn(
                name: "AppointmentTreatmentId",
                table: "ToothTreatments");

            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "AppointmentTreatments");

            migrationBuilder.DropColumn(
                name: "PaidAmount",
                table: "AppointmentTreatments");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "AppointmentTreatments");
        }
    }
}
