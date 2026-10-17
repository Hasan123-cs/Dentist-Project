using dentist_project.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dentist_project.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20261017124341_AllowStandaloneCheckupAppointments")]
    public partial class AllowStandaloneCheckupAppointments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Appointments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "Appointments",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PatientId",
                table: "Appointments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM "Appointments" WHERE "PatientId" IS NULL) THEN
                        RAISE EXCEPTION 'Cannot roll back while standalone appointments exist.';
                    END IF;
                END
                $$;
                """);

            migrationBuilder.AlterColumn<int>(
                name: "PatientId",
                table: "Appointments",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "Appointments");
        }
    }
}
