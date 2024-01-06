using System.Linq;
using System.Linq.Expressions;
using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class WordRepository : Repository<Word>, IWordRepository
{
    private AppDbContext _context;
    public WordRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

}
