namespace TTSPrep_API.Repository.IRepository;

public interface IUnitOfWork
{
    IChapterRepository Chapters { get; }
    IProjectRepository Projects { get; }
    ISpeakerRepository Speakers { get; }
    ITextBlockRepository TextBlocks { get; }
    ITextBlockLabelRepository TextBlockLabels { get; }
    IWordRepository Words { get; }
    string GetCurrentUserId();
    Task<bool> SaveAsync();
}
