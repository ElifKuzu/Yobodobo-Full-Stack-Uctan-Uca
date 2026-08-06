import { useNavigate, useParams } from "react-router-dom";
import type { BlogItem } from "../types/blog";
import { useEffect, useState } from "react";
import api from "../lib/api";

const BlogDetailPage: React.FC = () => {
    const {slug} = useParams();
    const [post, setPost] = useState<BlogItem | null>(null);
    const [loading, setLoading] = useState(true);
    const {userId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const res = await api.get<BlogItem>(`/api/blog/${slug}`);
                setPost(res.data);
            } catch (error) {
                console.error("Error fetching blog post:", error);
            } finally {
                setLoading(false);
            }
        };

        run();
    }, [slug]);

    const mine = !!(userId && post && userId === post.authorId);

    const OnDelete = async () => {
        if (!post) return;
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        await api.delete(`/api/blog/${post.id}`);
        navigate("/");
    };

    if (loading) {
        return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
    }

    if (!post) {
        return <div className="max-w-2xl mx-auto p-4">Post not found.</div>;
    }

    return(
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-600 mb-4">By {post.authorFullName ?? post.authorEmail} on {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
    );
}

export default BlogDetailPage;
