using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class TextBlockRepository: Repository<TextBlock>, ITextBlockRepository
{
    private AppDbContext _context;
    public TextBlockRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
}
