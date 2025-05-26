using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scribble.Migrations
{
    /// <inheritdoc />
    public partial class added_guessed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Guessed",
                table: "Chats",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Guessed",
                table: "Chats");
        }
    }
}
