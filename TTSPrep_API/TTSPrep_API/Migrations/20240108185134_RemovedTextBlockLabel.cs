using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TTSPrep_API.Migrations
{
    /// <inheritdoc />
    public partial class RemovedTextBlockLabel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TextBlocks_TextBlockLabel_TextBlockLabelId",
                table: "TextBlocks");

            migrationBuilder.DropTable(
                name: "TextBlockLabel");

            migrationBuilder.DropIndex(
                name: "IX_TextBlocks_TextBlockLabelId",
                table: "TextBlocks");

            migrationBuilder.DropColumn(
                name: "TextBlockLabelId",
                table: "TextBlocks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TextBlockLabelId",
                table: "TextBlocks",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TextBlockLabel",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ChapterId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextBlockLabel", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TextBlocks_TextBlockLabelId",
                table: "TextBlocks",
                column: "TextBlockLabelId");

            migrationBuilder.AddForeignKey(
                name: "FK_TextBlocks_TextBlockLabel_TextBlockLabelId",
                table: "TextBlocks",
                column: "TextBlockLabelId",
                principalTable: "TextBlockLabel",
                principalColumn: "Id");
        }
    }
}
