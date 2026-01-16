import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/modules/posts';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

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
      // Could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};
