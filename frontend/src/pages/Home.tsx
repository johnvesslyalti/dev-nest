import { useEffect, useState } from 'react';
import { postApi } from '../api/modules/posts';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Comments } from '../components/Comments';

interface Post {
  id: string;
  content: string;
  author: {
    username: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

export const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await postApi.getAll();
                // Response format is { success: true, items: [...], nextCursor: ... }
                setPosts(res.data.items || []); 
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Welcome to DevNest</h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                    The ultimate social platform for developers to share knowledge, connect, and grow together.
                </p>
                <div className="mt-8 flex gap-4">
                    <Link to="/register">
                         <Button size="lg">Get Started</Button>
                    </Link>
                    <Link to="/login">
                         <Button variant="outline" size="lg">Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleLike = async (postId: string, currentIsLiked: boolean) => {
        // Optimistic update
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !currentIsLiked,
                    _count: {
                        ...post._count,
                        likes: currentIsLiked ? post._count.likes - 1 : post._count.likes + 1
                    }
                };
            }
            return post;
        }));

        try {
            if (currentIsLiked) {
                await postApi.unlike(postId);
            } else {
                await postApi.like(postId);
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
            // Revert optimistic update on failure
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isLiked: currentIsLiked,
                        _count: {
                            ...post._count,
                            likes: currentIsLiked ? post._count.likes : post._count.likes
                        }
                    };
                }
                return post;
            }));
        }
    };

    const toggleComments = (postId: string) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    const handleCommentAdded = (postId: string) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    _count: {
                        ...post._count,
                        comments: post._count.comments + 1
                    }
                };
            }
            return post;
        }));
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <h1 className="text-2xl font-bold">Your Feed</h1>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div>
                                    <Link to={`/profile/${post.author.username}`} className="font-medium hover:underline">
                                        {post.author.name || post.author.username}
                                    </Link>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        @{post.author.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
                            
                            <div className="mt-4 flex items-center gap-6 text-gray-500 dark:text-gray-400">
                                <button 
                                    onClick={() => handleLike(post.id, post.isLiked || false)}
                                    className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-blue-600'}`}
                                >
                                    <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                    <span className="text-sm">{post._count?.likes || 0}</span>
                                </button>
                                <button 
                                    onClick={() => toggleComments(post.id)}
                                    className={`flex items-center gap-2 transition-colors ${expandedPostId === post.id ? 'text-blue-600' : 'hover:text-blue-600'}`}
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="text-sm">{post._count?.comments || 0}</span>
                                </button>
                                <button className="hover:text-blue-600 transition-colors">
                                     <Share2 className="h-5 w-5" />
                                </button>
                            </div>

                            {expandedPostId === post.id && (
                                <Comments 
                                    postId={post.id} 
                                    onCommentAdded={() => handleCommentAdded(post.id)} 
                                />
                            )}
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            No posts yet. Be the first to share something!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
