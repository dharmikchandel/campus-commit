import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

interface Post {
    _id: string;
    title: string;
    slug: string;
    content: string;
    author: {
        username: string;
    };
    tags: string[];
    createdAt: string;
}

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get('/posts');
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-bg">
            <div className="text-4xl font-black animate-pulse text-neo-primary">LOADING...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg">
            {/* Hero Section */}
            <section className="bg-surface border-b-3 border-text-primary py-20 px-4">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-primary uppercase">
                        Welcome to <span className="text-accent-1 text-stroke">The Club</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-text-secondary font-medium max-w-2xl mx-auto">
                        A space for raw thoughts and bold ideas.
                        <br />Join the conversation.
                    </p>
                    <div className="pt-4">
                        <Link to="/create-post">
                            <Button size="lg" className="text-xl px-12 h-16 hover:-translate-y-[1px] hover:-translate-x-[1px] transition-transform">Start Writing</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black uppercase border-b-4 border-accent-1 inline-block pb-2">Latest Drops</h2>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 border-3 border-dashed border-text-secondary/30 rounded-none">
                        <h3 className="text-2xl font-bold text-text-secondary mb-4">No content yet.</h3>
                        <Link to="/create-post">
                            <Button variant="outline">Be the first</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link to={`/posts/${post.slug}`} key={post._id} className="group">
                                <Card className="h-full flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform duration-0 cursor-pointer border-3">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {post.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="bg-bg border-2 border-text-primary px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-none">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-2xl font-black leading-tight group-hover:text-accent-1 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-text-secondary line-clamp-3 font-medium">
                                            {post.content.replace(/[#*`_]/g, '')}
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t-3 border-dashed border-text-primary/20 flex justify-between items-center text-sm font-bold text-text-secondary">
                                        <span>@{post.author?.username || 'Anonymous'}</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
