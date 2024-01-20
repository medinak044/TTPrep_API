using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TTSPrep_API.Data;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _context;
    internal DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public virtual async Task<bool> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        return true;
    }

    public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }

    public virtual IEnumerable<T> GetSome(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Where(predicate);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T> GetByIdAsync(string id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<bool> RemoveAsync(T entity)
    {
        _dbSet.Remove(entity);
        return true;
    }

    public virtual async Task<bool> RemoveRangeAsync(IEnumerable<T> entity)
    {
        _dbSet.RemoveRange(entity);
        return true;
    }

    public virtual async Task<bool> UpdateAsync(T entity)
    {
        _context.Update(entity);
        return true; // Remember to call Save() after this
    }

    public virtual bool UpdateRange(IEnumerable<T> entities)
    {
        //_context.AttachRange(entities); // In case other entities were previously attached within the same method call
        //foreach (var entity in entities)
        //{ _context.Entry(entity).State = EntityState.Modified; }


        _context.UpdateRange(entities);
        return true;
    }
}
