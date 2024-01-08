using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TTSPrep_API.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteSpeaker : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProjectId",
                table: "Speakers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Speakers_ProjectId",
                table: "Speakers",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Speakers_Projects_ProjectId",
                table: "Speakers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Speakers_Projects_ProjectId",
                table: "Speakers");

            migrationBuilder.DropIndex(
                name: "IX_Speakers_ProjectId",
                table: "Speakers");

            migrationBuilder.AlterColumn<string>(
                name: "ProjectId",
                table: "Speakers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
