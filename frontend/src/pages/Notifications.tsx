import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notifications as notificationApi } from '../api/client';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW';
  read: boolean;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  };
  post?: {
    id: string;
    content: string;
  };
  comment?: {
    id: string;
    content: string;
  };
}

export const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data } = await notificationApi.getAll();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationApi.markRead(id);
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            toast.success('All marked as read');
        } catch (error) {
             console.error('Failed to mark all as read:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4">
                 <div className="animate-pulse space-y-4">
                     {[1, 2, 3].map(i => (
                         <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                     ))}
                 </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                {notifications.some(n => !n.read) && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification.id}
                            className={`flex gap-4 p-4 rounded-xl transition-all ${
                                notification.read 
                                    ? 'bg-transparent' 
                                    : 'bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800'
                            }`}
                        >
                            <div className="shrink-0 pt-1">
                                {notification.type === 'LIKE' && (
                                    <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                        <Heart className="h-4 w-4 fill-current" />
                                    </div>
                                )}
                                {notification.type === 'COMMENT' && (
                                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <MessageCircle className="h-4 w-4 fill-current" />
                                    </div>
                                )}
                                {notification.type === 'FOLLOW' && (
                                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <UserPlus className="h-4 w-4" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                        <Link to={`/profile/${notification.actor.username}`}>
                                            <Avatar src={notification.actor.avatarUrl || undefined} alt={notification.actor.name || 'User'} size="sm" />
                                        </Link>
                                        <div className="text-sm">
                                            <Link to={`/profile/${notification.actor.username}`} className="font-semibold text-gray-900 dark:text-white hover:underline">
                                                {notification.actor.name}
                                            </Link>
                                            <span className="text-gray-500 mx-1">
                                                {notification.type === 'LIKE' && 'liked your post'}
                                                {notification.type === 'COMMENT' && 'commented on your post'}
                                                {notification.type === 'FOLLOW' && 'started following you'}
                                            </span>
                                        </div>
                                     </div>
                                     <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                     </span>
                                </div>

                                {notification.post && (
                                    <Link to={`/feed`} className="block mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors truncate">
                                        {notification.post.content}
                                    </Link>
                                )}
                            </div>

                            {!notification.read && (
                                <button 
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="shrink-0 self-center p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                                    title="Mark as read"
                                >
                                    <div className="h-2 w-2 bg-current rounded-full" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
