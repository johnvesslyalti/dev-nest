import { useState, useEffect } from 'react';
import { commentApi } from '../api/modules/comments';
import { Button } from './Button';
import { Input } from './Input';
import { Avatar } from './Avatar';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        username: string;
        name: string;
        avatarUrl?: string;
    };
}

interface CommentsProps {
    postId: string;
    onCommentAdded?: () => void;
}

export const Comments = ({ postId, onCommentAdded }: CommentsProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await commentApi.getByPost(postId);
                const data = res.data;
                setComments(Array.isArray(data) ? data : data.items || []);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await commentApi.create(postId, newComment);
            setComments([res.data.comment, ...comments]);
            setNewComment('');
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error("Failed to create comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-4 text-center text-sm text-gray-500">Loading comments...</div>;

    return (
        <div className="bg-gray-50/50 dark:bg-gray-900/50 -mx-6 -mb-6 p-6 border-t border-gray-100 dark:border-gray-800">
            <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
                <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                />
                <Button type="submit" disabled={isSubmitting || !newComment.trim()} size="md">
                    Post
                </Button>
            </form>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                        <Link to={`/profile/${comment.author.username}`}>
                             <Avatar src={comment.author.avatarUrl} alt={comment.author.name} size="sm" />
                        </Link>
                        <div className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-1">
                                <Link to={`/profile/${comment.author.username}`} className="text-sm font-semibold hover:underline text-gray-900 dark:text-gray-100">
                                    {comment.author.name || comment.author.username}
                                </Link>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center text-sm text-gray-500 py-2">
                        No comments yet.
                    </div>
                )}
            </div>
        </div>
    );
};
