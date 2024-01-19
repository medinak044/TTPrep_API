using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TTSPrep_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedCurrentChapterProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Label",
                table: "TextBlocks");

            migrationBuilder.AddColumn<string>(
                name: "CurrentChapterId",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentChapterId",
                table: "Projects");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "TextBlocks",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
