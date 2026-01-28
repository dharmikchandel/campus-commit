import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import api from '../services/api';
import CommentSection from '../components/features/CommentSection';
import { Card } from '../components/ui/Card';

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        username: string;
    };
    createdAt: string;
    tags: string[];
}

const PostDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/posts/slug/${slug}`);
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch post', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) return <div className="p-8 text-center font-bold">LOADING...</div>;
    if (!post) return <div className="p-8 text-center font-bold text-accent-1">POST NOT FOUND</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Card className="mb-8 p-8 md:p-12">
                <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight text-text-primary">{post.title}</h1>
                <div className="flex items-center space-x-4 text-sm font-mono border-b-3 border-text-primary pb-6 mb-8">
                    <span className="font-bold bg-accent-1 text-white px-3 py-1 shadow-brutal-active border-2 border-text-primary">@{post.author.username}</span>
                    <span className="font-bold text-text-secondary">{new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.tags.length > 0 && (
                        <div className="flex space-x-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-text-primary font-bold uppercase border-b-2 border-accent-2">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-text-primary prose-p:font-medium prose-p:text-text-base prose-a:text-accent-2 prose-a:font-bold prose-strong:text-text-primary prose-code:bg-bg prose-code:px-1 prose-code:text-accent-1 prose-img:border-3 prose-img:border-text-primary prose-img:shadow-brutal-card">
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </Card>

            <CommentSection postId={post._id} />
        </div>
    );
};

export default PostDetails;
