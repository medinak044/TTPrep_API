using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TTSPrep_API.Controllers;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_Tests.Controller;

public class WordControllerTests
{
    private IUnitOfWork _unitOfWork;
    private UserManager<AppUser> _userManager;

    public WordControllerTests()
    {
        _unitOfWork = A.Fake<IUnitOfWork>();
        _userManager = A.Fake<UserManager<AppUser>>();
    }

    private WordController CreateNewController()
    {
        return new WordController(_unitOfWork, _userManager);
    }

    [Fact]
    public async Task WordController_GetAllWords_ReturnOk()
    {
        // Arrange
        var controller = CreateNewController();

        // Act
        var result = await controller.GetAllWords();

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task WordController_CreateWord_ReturnOk()
    {
        // Arrange
        var wordForm = A.Fake<Word>();
        wordForm.ProjectId = Guid.NewGuid().ToString();

        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.CreateWord(wordForm);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task WordController_UpdateWord_ReturnOk()
    {
        // Arrange
        var wordForm = A.Fake<Word>();

        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.UpdateWord(wordForm);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task WordController_RemoveWord_ReturnOk()
    {
        // Arrange
        var wordForm = A.Fake<Word>();
        wordForm.Id = Guid.NewGuid().ToString();

        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.RemoveWord(wordForm.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

}
