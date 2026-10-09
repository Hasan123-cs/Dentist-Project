using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dentist_project.Migrations
{
    /// <inheritdoc />
    public partial class schema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedAt",
                table: "Notifications",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApprovedById",
                table: "Notifications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "Notifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ApprovedById",
                table: "Notifications",
                column: "ApprovedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_ApprovedById",
                table: "Notifications",
                column: "ApprovedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_ApprovedById",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ApprovedById",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ApprovedAt",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ApprovedById",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Notifications");
        }
    }
}
