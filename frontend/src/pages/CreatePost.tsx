import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/modules/posts';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';

export const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await postApi.create({ content });
      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Post</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Avatar src={user.avatarUrl} alt={user.name} />
            <div className="flex-1">
              <textarea
                className="w-full min-h-[150px] p-0 border-0 bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 resize-none dark:text-gray-100"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
             <div className="text-sm text-gray-500">
               {content.length > 0 && `${content.length} characters`}
             </div>
             <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim() || isSubmitting} className="min-w-[100px]">
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
