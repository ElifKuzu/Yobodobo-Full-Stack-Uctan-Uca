namespace YoboApi.Utils;

public static class SlugHelper
{
    public static string ToSlug(string text)
    {
        // Convert to lowercase
        string slug = text.ToLowerInvariant().Trim();

        slug = text.Replace("ş", "s").Replace("Ş", "s")
                   .Replace("ı", "i").Replace("İ", "i")
                   .Replace("ç", "c").Replace("Ç", "c")
                   .Replace("ü", "u").Replace("Ü", "u")
                   .Replace("ö", "o").Replace("Ö", "o")
                   .Replace("ğ", "g").Replace("Ğ", "g");

        // Remove invalid characters
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");

        // Replace spaces with hyphens
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", "-").Trim('-');

        // Limit the length of the slug (optional)
        if (slug.Length > 200)
        {
            slug = slug.Substring(0, 200);
        }

        return slug;
    }
}