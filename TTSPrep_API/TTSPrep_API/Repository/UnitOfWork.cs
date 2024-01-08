using TTSPrep_API.Data;
using TTSPrep_API.Helpers;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class UnitOfWork: IUnitOfWork, IDisposable
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UnitOfWork(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor
        )
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public IChapterRepository Chapters => new ChapterRepository(_context);
    public IProjectRepository Projects => new ProjectRepository(_context);
    public ISpeakerRepository Speakers => new SpeakerRepository(_context);
    public ITextBlockRepository TextBlocks => new TextBlockRepository(_context);
    public ITextBlockLabelRepository TextBlockLabels => new TextBlockLabelRepository(_context);
    public IWordRepository Words => new WordRepository(_context);

    // Used for .NET session (cookie) authentication
    public string GetCurrentUserId()
    {
        return _httpContextAccessor.HttpContext?.User.GetUserId(); // Gets user Id value from cookie
    }

    public async Task<bool> SaveAsync()
    {
        var saved = await _context.SaveChangesAsync(); // Returns an integer
        return saved > 0 ? true : false;
    }
    public void Dispose()
    {
        _context.Dispose();
    }
}
