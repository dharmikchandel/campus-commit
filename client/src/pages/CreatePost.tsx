import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import ReactMarkdown from 'react-markdown';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const navigate = useNavigate();
    const [view, setView] = useState<'edit' | 'preview'>('edit'); // Mobile toggle

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/posts', {
                title,
                content,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to create post');
        }
    };

    return (
        <div className="min-h-screen bg-bg py-8 px-4 flex justify-center">
            <Card className="w-full max-w-4xl border-3 border-text-primary p-8 flex flex-col h-[calc(100vh-100px)] rounded-sm">
                <form onSubmit={handleSubmit} className="flex flex-col h-full gap-6">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                        <input
                            type="text"
                            placeholder="POST TITLE..."
                            className="w-full text-3xl md:text-5xl font-black bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-text-secondary/30 uppercase tracking-tight p-0 caret-accent-1"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <div className="flex gap-2 shrink-0">
                            <Button type="button" variant="outline" size="sm" onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}>
                                {view === 'edit' ? 'PREVIEW' : 'EDIT'}
                            </Button>
                        </div>
                    </div>

                    {/* Editor / Preview Area */}
                    <div className="flex-1 border-3 border-text-primary bg-bg p-4 overflow-hidden relative">
                        {view === 'edit' ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-lg text-text-primary placeholder:text-text-secondary/60 leading-relaxed p-2"
                                placeholder="# WRITE YOUR MASTERPIECE..."
                                required
                            />
                        ) : (
                            <div className="h-full overflow-y-auto prose prose-lg prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-p:font-medium p-2">
                                {content ? (
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-text-secondary opacity-50 font-bold text-xl uppercase tracking-widest">
                                        PREVIEW EMPTY
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <Input
                            placeholder="TAGS (COMMA SEPARATED)..."
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full md:w-auto font-bold uppercase flex-1"
                        />
                        <div className="shrink-0 w-full md:w-auto flex justify-end">
                            <Button type="submit" variant="primary" size="lg" className="hidden md:flex">
                                PUBLISH
                            </Button>
                            <Button type="submit" variant="primary" size="sm" className="flex md:hidden w-full">
                                POST
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreatePost;
