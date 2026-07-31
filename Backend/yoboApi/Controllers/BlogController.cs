using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yoboApi.Data;
using YoboApi.Dtos;
using YoboApi.Models;
using YoboApi.Utils;

namespace YoboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlogController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<BlogResponse>>> List([FromQuery] int page = 1, [FromQuery] int pageSize = 10,[FromQuery] string? q = null, [FromQuery] string? authorId = null, [FromQuery] bool? onlyPublished = true)
    {
        if (page <1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;


        var query = _context.BlogPosts.AsQueryable();

        if (!string.IsNullOrEmpty(q))
        {
            query = query.Where(b => b.Title.Contains(q) || b.Content.Contains(q));
        }
        if(!string.IsNullOrEmpty(authorId))
        {
            query = query.Where(b => b.AuthorId == authorId);
        }
        
        var items = await query
            .Include(b => b.Author)
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = items.Select(b => new BlogResponse
        {
            Id = b.Id,
            Title = b.Title,
            Slug = b.Slug,
            Content = b.Content,
            AuthorId = b.AuthorId,
            AuthorFullName = b.Author?.FullName,
            AuthorEmail = b.Author?.Email,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt,
            IsPublished = b.IsPublished
        }).ToList();
        return Ok(result);
    }
    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<BlogResponse>> GetBySlug([FromRoute] string slug)
    {
        var blog = await _context.BlogPosts
            .Include(b => b.Author)
            .FirstOrDefaultAsync(b => b.Slug == slug);

        if (blog == null)
        {
            return NotFound();
        }

        var result = new BlogResponse
        {
            Id = blog.Id,
            Title = blog.Title,
            Slug = blog.Slug,
            Content = blog.Content,
            AuthorId = blog.AuthorId,
            AuthorFullName = blog.Author?.FullName,
            AuthorEmail = blog.Author?.Email,
            CreatedAt = blog.CreatedAt,
            UpdatedAt = blog.UpdatedAt,
            IsPublished = blog.IsPublished
        };

        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<BlogResponse>> Create([FromBody] BlogCreateDto dto)
    {
        var uid = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var baseSlug = SlugHelper.ToSlug(dto.Title);
        var slug = baseSlug;
        int i = 2;
        while (await _context.BlogPosts.AnyAsync(b => b.Slug == slug))
        {
            slug = $"{baseSlug}-{i}";
            i++;
        }
        
        var entity = new BlogPost
        {
            Title = dto.Title,
            Slug = slug,
            Content = dto.Content,
            AuthorId = uid!,
            IsPublished = dto.IsPublished
        };
        _context.BlogPosts.Add(entity);
        await _context.SaveChangesAsync();

        var resp = new BlogResponse
        {
            Id = entity.Id,
            Title = entity.Title,
            Slug = entity.Slug,
            Content = entity.Content,
            AuthorId = entity.AuthorId,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            IsPublished = entity.IsPublished
        };

        return CreatedAtAction(nameof(GetBySlug), new { slug = entity.Slug }, resp);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<BlogResponse>> Update([FromRoute] int id, [FromBody] BlogUpdateDto dto)
    {
        var uid = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var entity = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Id == id);

        if(entity.AuthorId != uid)
        {
            return Forbid();
        }
        
        if(!string.Equals(entity.Title, dto.Title, StringComparison.OrdinalIgnoreCase))
        {
            var baseSlug = SlugHelper.ToSlug(dto.Title);
            var slug = baseSlug;
            int i = 2;
            while (await _context.BlogPosts.AnyAsync(b => b.Slug == slug && b.Id != id))
            {
                slug = $"{baseSlug}-{i}";
                i++;
            }
            entity.Slug = slug;
            entity.Title = dto.Title;
        }
        else
        {
            entity.Title = dto.Title;
        }
        entity.Content = dto.Content;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var uid = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var entity = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Id == id);

        if (entity == null)
        {
            return NotFound();
        }

        if (entity.AuthorId != uid)
        {
            return Forbid();
        }

        _context.BlogPosts.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}