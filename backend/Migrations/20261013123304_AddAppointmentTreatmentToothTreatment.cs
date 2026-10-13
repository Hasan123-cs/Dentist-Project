using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dentist_project.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentTreatmentToothTreatment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentTreatments_ToothTreatments_ToothTreatmentId",
                table: "AppointmentTreatments");

            migrationBuilder.DropForeignKey(
                name: "FK_ToothTreatments_AppointmentTreatments_AppointmentTreatmentId",
                table: "ToothTreatments");

            migrationBuilder.DropIndex(
                name: "IX_ToothTreatments_AppointmentTreatmentId",
                table: "ToothTreatments");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentTreatments_ToothTreatmentId",
                table: "AppointmentTreatments");

            migrationBuilder.DropColumn(
                name: "AppointmentTreatmentId",
                table: "ToothTreatments");

            migrationBuilder.DropColumn(
                name: "ToothTreatmentId",
                table: "AppointmentTreatments");

            migrationBuilder.CreateTable(
                name: "AppointmentTreatmentToothTreatments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppointmentTreatmentId = table.Column<int>(type: "integer", nullable: false),
                    ToothTreatmentId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentTreatmentToothTreatments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentTreatmentToothTreatments_AppointmentTreatments_A~",
                        column: x => x.AppointmentTreatmentId,
                        principalTable: "AppointmentTreatments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppointmentTreatmentToothTreatments_ToothTreatments_ToothTr~",
                        column: x => x.ToothTreatmentId,
                        principalTable: "ToothTreatments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentTreatmentToothTreatments_AppointmentTreatmentId",
                table: "AppointmentTreatmentToothTreatments",
                column: "AppointmentTreatmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentTreatmentToothTreatments_ToothTreatmentId",
                table: "AppointmentTreatmentToothTreatments",
                column: "ToothTreatmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentTreatmentToothTreatments");

            migrationBuilder.AddColumn<int>(
                name: "AppointmentTreatmentId",
                table: "ToothTreatments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ToothTreatmentId",
                table: "AppointmentTreatments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ToothTreatments_AppointmentTreatmentId",
                table: "ToothTreatments",
                column: "AppointmentTreatmentId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_ToothTreatments_AppointmentTreatments_AppointmentTreatmentId",
                table: "ToothTreatments",
                column: "AppointmentTreatmentId",
                principalTable: "AppointmentTreatments",
                principalColumn: "Id");
        }
    }
}
