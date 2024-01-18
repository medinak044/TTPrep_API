using System.Linq.Expressions;
using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class ChapterRepository: Repository<Chapter>, IChapterRepository
{
    private AppDbContext _context;
    public ChapterRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public override IEnumerable<Chapter> GetSome(Expression<Func<Chapter, bool>> predicate)
    {
        IQueryable<Chapter> chapters = _context.Chapters.Where(predicate);

        // Include the navigation property values
        foreach (Chapter chapter in chapters)
        {
            chapter.TextBlocks = _context.TextBlocks.Where(t => t.ChapterId == chapter.Id).ToList();
            chapter.TextBlockLabels = _context.TextBlockLabels.Where(t => t.ChapterId != chapter.Id).ToList();
        }

        return chapters;
    }

    public override async Task<Chapter> GetByIdAsync(string projectId)
    {
        Chapter chapter = await _context.Chapters.FindAsync(projectId);
        _context.Entry(chapter).Collection(c => c.TextBlocks).Load();
        _context.Entry(chapter).Collection(c => c.TextBlockLabels).Load();

        return chapter;
    }
}
