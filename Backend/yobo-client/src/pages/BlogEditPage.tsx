import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { BlogCreateRequest, BlogItem, BlogUpdateRequest } from "../types/blog";
import { useEffect, useState } from "react";
import api from "../lib/api";

type NavState = {post?: BlogItem};

const BlogEditPage: React.FC = () => {
    const {id} = useParams();
    const {state} = useLocation() as {state: NavState};
    const navigate = useNavigate();

    const editing = !!id;
    const initial = state?.post;

    const [title, setTitle] = useState(initial?.title ?? "");
    const [content, setContent] = useState(initial?.content ?? "");
    const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (editing && !initial) {
            setError("No post data provided for editing.");
        }
    }, [editing, initial]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setError(null);

        try{
            if (editing) {
                const dto: BlogUpdateRequest = {title, content, isPublished};
                await api.put(`/api/blog/${id}`, dto);
                navigate("/");
            }else{
                const dto: BlogCreateRequest = {title, content, isPublished};
                const res = await api.post("/api/blog", dto);
                navigate(`/blog/${res.data.slug}`);
            }
        }catch(err: any){
            setError(err.response?.data?.message ?? "An error occurred.");
        }finally{
            setBusy(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{editing ? "Edit Blog Post" : "Create Blog Post"}</h1>
            {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={10}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Published</label>
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="mr-2"
                    />
                    <span>Mark as published</span>
                </div>
                <button
                    type="submit"
                    disabled={busy}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
                >
                    {busy ? "Saving..." : editing ? "Update Post" : "Create Post"}
                </button>
            </form>
        </div>
    );
};

export default BlogEditPage;