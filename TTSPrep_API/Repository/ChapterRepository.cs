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
}
