using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scribble.Migrations
{
    /// <inheritdoc />
    public partial class updatemodelsminor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Players_Rooms_RoomId",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_RoomId",
                table: "Players");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Players",
                newName: "UserName");

            migrationBuilder.AlterColumn<string>(
                name: "RoomId",
                table: "Players",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "RoomId1",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Players_RoomId1",
                table: "Players",
                column: "RoomId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Rooms_RoomId1",
                table: "Players",
                column: "RoomId1",
                principalTable: "Rooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Players_Rooms_RoomId1",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_RoomId1",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RoomId1",
                table: "Players");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Players",
                newName: "Username");

            migrationBuilder.AlterColumn<int>(
                name: "RoomId",
                table: "Players",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Players_RoomId",
                table: "Players",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Rooms_RoomId",
                table: "Players",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
