using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace dentist_project.Migrations
{
    /// <inheritdoc />
    public partial class MakeToothOptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Teeth",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.AlterColumn<int>(
                name: "ToothId",
                table: "ToothTreatments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ToothId",
                table: "ToothTreatments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "Teeth",
                columns: new[] { "Id", "Name", "Number" },
                values: new object[,]
                {
                    { 1, "Upper Right Central Incisor", 11 },
                    { 2, "Upper Right Lateral Incisor", 12 },
                    { 3, "Upper Right Canine", 13 },
                    { 4, "Upper Right First Premolar", 14 },
                    { 5, "Upper Right Second Premolar", 15 },
                    { 6, "Upper Right First Molar", 16 },
                    { 7, "Upper Right Second Molar", 17 },
                    { 8, "Upper Right Third Molar", 18 },
                    { 9, "Upper Left Central Incisor", 21 },
                    { 10, "Upper Left Lateral Incisor", 22 },
                    { 11, "Upper Left Canine", 23 },
                    { 12, "Upper Left First Premolar", 24 },
                    { 13, "Upper Left Second Premolar", 25 },
                    { 14, "Upper Left First Molar", 26 },
                    { 15, "Upper Left Second Molar", 27 },
                    { 16, "Upper Left Third Molar", 28 },
                    { 17, "Lower Left Central Incisor", 31 },
                    { 18, "Lower Left Lateral Incisor", 32 },
                    { 19, "Lower Left Canine", 33 },
                    { 20, "Lower Left First Premolar", 34 },
                    { 21, "Lower Left Second Premolar", 35 },
                    { 22, "Lower Left First Molar", 36 },
                    { 23, "Lower Left Second Molar", 37 },
                    { 24, "Lower Left Third Molar", 38 },
                    { 25, "Lower Right Central Incisor", 41 },
                    { 26, "Lower Right Lateral Incisor", 42 },
                    { 27, "Lower Right Canine", 43 },
                    { 28, "Lower Right First Premolar", 44 },
                    { 29, "Lower Right Second Premolar", 45 },
                    { 30, "Lower Right First Molar", 46 },
                    { 31, "Lower Right Second Molar", 47 },
                    { 32, "Lower Right Third Molar", 48 }
                });
        }
    }
}
