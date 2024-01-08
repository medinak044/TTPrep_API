using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class TextBlockLabelRepository: Repository<TextBlockLabel>, ITextBlockLabelRepository
{
    private readonly AppDbContext _context;

    public TextBlockLabelRepository(AppDbContext context): base(context)
    {
        _context = context;
    }
}
