import React, { useEffect, useState, useRef } from 'react';
import { socket } from '../../services/socket';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface Comment {
    _id: string;
    text: string;
    user: {
        _id: string;
        username: string;
    };
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useAuth();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch initial comments
        const fetchComments = async () => {
            try {
                const { data } = await api.get(`/posts/${postId}/comments`);
                setComments(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchComments();

        // Socket.io
        if (!socket.connected) socket.connect();
        socket.emit('joinPost', postId);

        const handleNewComment = (comment: Comment) => {
            // Prevent duplicate if we added it optimistically (not doing optimistic here for simplicity)
            setComments((prev) => [...prev, comment]);
            // Scroll to bottom
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        };

        const handleDeleteComment = (commentId: string) => {
            setComments((prev) => prev.filter(c => c._id !== commentId));
        };

        socket.on('new-comment', handleNewComment);
        socket.on('delete-comment', handleDeleteComment);

        return () => {
            socket.emit('leavePost', postId);
            socket.off('new-comment', handleNewComment);
            socket.off('delete-comment', handleDeleteComment);
        };
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.post(`/posts/${postId}/comments`, { text: newComment });
            setNewComment('');
            // Socket will handle the update
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await api.delete(`/posts/${postId}/comments/${commentId}`);
            // Socket handle update
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-black mb-6 uppercase border-b-3 border-text-primary inline-block pb-1">Comments ({comments.length})</h3>

            <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                    <div key={comment._id} className="bg-surface border-3 border-text-primary p-4 shadow-brutal-card transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]">
                        <div className="flex justify-between items-start mb-2 border-b-3 border-text-primary pb-2">
                            <span className="font-bold text-accent-2 tracking-wide">@{comment.user.username}</span>
                            <span className="text-xs font-mono text-text-secondary">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="whitespace-pre-wrap font-medium">{comment.text}</p>
                        {(user?.role === 'admin' || user?._id === comment.user._id) && (
                            <button
                                onClick={() => handleDelete(comment._id)}
                                className="text-xs text-white bg-accent-1 font-bold mt-4 px-2 py-1 uppercase border-2 border-text-primary hover:bg-white hover:text-accent-1 transition-none"
                            >
                                DELETE
                            </button>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {user ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="WRITE A COMMENT..."
                        className="w-full p-4 border-3 border-text-primary bg-surface focus:outline-none focus:outline-2 focus:outline-accent-2 shadow-brutal-btn rounded-none h-32 text-sm font-medium"
                    />
                    <div className="flex justify-end">
                        <Button type="submit">POST COMMENT</Button>
                    </div>
                </form>
            ) : (
                <div className="p-6 border-3 border-text-primary bg-text-secondary text-surface text-center font-black uppercase tracking-widest rounded-sm">
                    LOGIN TO PARTICIPATE IN THE SIGNAL
                </div>
            )}
        </div>
    );
};

export default CommentSection;
