using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TTSPrep_API.Migrations
{
    /// <inheritdoc />
    public partial class TextBlockLabel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TextBlockLabelId",
                table: "TextBlocks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TextBlockLabels",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChapterId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextBlockLabels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TextBlockLabels_Chapters_ChapterId",
                        column: x => x.ChapterId,
                        principalTable: "Chapters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TextBlockLabels_ChapterId",
                table: "TextBlockLabels",
                column: "ChapterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TextBlockLabels");

            migrationBuilder.DropColumn(
                name: "TextBlockLabelId",
                table: "TextBlocks");
        }
    }
}
