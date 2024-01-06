using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class SpeakerRepository : Repository<Speaker>, ISpeakerRepository
{
    private AppDbContext _context;
    public SpeakerRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
}
