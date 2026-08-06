import { useEffect, useState } from "react";
import type { BlogItem } from "../types/blog";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../lib/api";

const BlogListPage: React.FC = () => {
    const [items, setItems] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [q, setQ] = useState("");
    const navigate = useNavigate();
    const { user, userId, logout } = useAuth();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get<BlogItem[]>("/api/blog", {
                params: { page: 1, q: q || undefined, onlyPublished: true },
            });
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching blog items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };
console.log("Context'ten Gelen userId:", userId);
console.log("Gelen Blog Maddeleri:", items.map(b => ({ title: b.title, authorId: b.authorId })));
    const onDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this blog item?")) return;
        try {
            await api.delete(`/api/blog/${id}`);
            await fetchData();
        } catch (error) {
            console.error("Error deleting blog item:", error);
        }
    };

    return (
        <div style={{ maxWidth: 960, margin: "32px auto" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1>Blog List</h1>
                    <div>
                        Hoş Geldin <b>{user?.fullName || user?.email}</b>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => navigate("/blog/new")}>New Blog Post</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </header>

            <form onSubmit={onSearch} style={{ margin: "16px 0", display: "flex", gap: 8 }}>
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : items.length === 0 ? (
                <p>No blogs found.</p>
            ) : (
                <div>
                    {items.map((b) => {
                        // Tip farkı ihtimaline karşı ikisini de String'e çevirerek karşılaştırıyoruz
                        const mine = Boolean(userId && String(b.authorId) === String(userId));
                        return (
                            <div key={b.id} style={{ margin: "16px 0", padding: "16px", border: "1px solid #ccc" }}>
                                <h2>{b.title}</h2>

                                <p>{b.content}</p>
                                <div>
                                    {b.authorFullName ?? b.authorEmail} - {new Date(b.createdAt).toLocaleString()}
                                </div>
                                <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                                    <button onClick={() => navigate(`/blog/${b.slug}`)}>View Details</button>
                                    {mine && (
                                        <>
                                            <Link to={`/blog/edit/${b.id}`}>Edit</Link>
                                            <button onClick={() => onDelete(b.id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BlogListPage;