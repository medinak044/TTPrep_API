using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository;

namespace TTSPrep_Tests.Repository;

public class WordRepositoryTests
{
    private async Task<AppDbContext> GetDatabaseContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var databaseContext = new AppDbContext(options);
        databaseContext.Database.EnsureCreated();
        if (await databaseContext.Words.CountAsync() <= 0)
        {
            for (int i = 1; i <= 10; i++) // Create 10 (fake) db records
            {
                databaseContext.Words.Add(
                new Word()
                {
                    Id = i.ToString(),
                    OriginalSpelling = "word"+ i,
                    ModifiedSpelling = "wurd"+ i,
                    ProjectId = i.ToString()
                });
                await databaseContext.SaveChangesAsync();
            }
        }
        return databaseContext;
    }

    [Fact]
    public async Task WordRepository_ExistsAsync_ReturnsTrue()
    {
        // Arrange
        var projectId = "1";
        var context = await GetDatabaseContext();
        var wordRepository = new WordRepository(context);


        // Assert
        var result = await wordRepository.ExistsAsync(w => w.ProjectId == projectId);

        // Act
        result.Should().BeTrue();
    }

    [Fact]
    public async Task WordRepository_GetSome_ReturnsWords()
    {
        // Arrange
        var originalSpellingSet = new HashSet<string>()
        {
            "word",
            "wort"
        };
        var context = await GetDatabaseContext();
        var wordRepository = new WordRepository(context);

        // Assert
        var result = wordRepository.GetSome(w => originalSpellingSet.Contains(w.OriginalSpelling));

        // Act
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task WordRepository_GetAllAsync_ReturnsWords()
    {
        // Arrange
        var context = await GetDatabaseContext();
        var wordRepository = new WordRepository(context);

        // Assert
        var result = await wordRepository.GetAllAsync();

        // Act
        result.Should().BeOfType<List<Word>>();
    }

    [Fact]
    public async Task WordRepository_GetByIdAsync_ReturnsWords()
    {
        // Arrange
        string wordId = "1";
        var context = await GetDatabaseContext();
        var wordRepository = new WordRepository(context);

        // Assert
        var result = await wordRepository.GetByIdAsync(wordId);

        // Act
        result.Should().BeOfType<Word>();
    }

    [Fact]
    public async Task WordRepository_RemoveAsync_ReturnsTrue()
    {
        // Arrange
        var wordToBeDeleted = new Word()
        {
            Id = "111",
            OriginalSpelling = "word1"
        };
        var context = await GetDatabaseContext();
        var wordRepository = new WordRepository(context);

        // Assert
        var result = await wordRepository.RemoveAsync(wordToBeDeleted);

        // Act
        result.Should().BeTrue();
    }

    [Fact]
    public async Task WordRepository_UpdateAsync_ReturnsTrue()
    {
        // Arrange
        var wordToBeUpdated = new Word()
        {
            Id = "111",
            OriginalSpelling = "Word1"
        };
        var context = await GetDatabaseContext();
        var wordRepository = new WordRepository(context);

        // Assert
        var result = await wordRepository.UpdateAsync(wordToBeUpdated);

        // Act
        result.Should().BeTrue();
    }
}
