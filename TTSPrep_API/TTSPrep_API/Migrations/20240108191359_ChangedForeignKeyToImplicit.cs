using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TTSPrep_API.Migrations
{
    /// <inheritdoc />
    public partial class ChangedForeignKeyToImplicit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TextBlocks_Speakers_SpeakerId",
                table: "TextBlocks");

            migrationBuilder.DropIndex(
                name: "IX_TextBlocks_SpeakerId",
                table: "TextBlocks");

            migrationBuilder.AlterColumn<string>(
                name: "SpeakerId",
                table: "TextBlocks",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SpeakerId",
                table: "TextBlocks",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TextBlocks_SpeakerId",
                table: "TextBlocks",
                column: "SpeakerId");

            migrationBuilder.AddForeignKey(
                name: "FK_TextBlocks_Speakers_SpeakerId",
                table: "TextBlocks",
                column: "SpeakerId",
                principalTable: "Speakers",
                principalColumn: "Id");
        }
    }
}
