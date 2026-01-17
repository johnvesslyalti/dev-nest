import { useState, useEffect } from 'react';
import { commentApi } from '../api/modules/comments';
import { Button } from './Button';
import { Input } from './Input';
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
                setComments(res.data.items || []);
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
            setComments([res.data, ...comments]);
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
        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-b-lg">
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                />
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                    Post
                </Button>
            </form>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Link to={`/profile/${comment.author.username}`} className="text-sm font-medium hover:underline">
                                    {comment.author.name || comment.author.username}
                                </Link>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{comment.content}</p>
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
