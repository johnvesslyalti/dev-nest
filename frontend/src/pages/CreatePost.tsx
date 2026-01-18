import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/modules/posts';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { Smile, Image as ImageIcon, X } from 'lucide-react';

export const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedFile) return;

    setIsSubmitting(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('image', selectedFile);
        await postApi.create(formData);
      } else {
        await postApi.create({ content });
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Post</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Avatar src={user.avatarUrl} alt={user.name} />
            <div className="flex-1 space-y-4">
              <textarea
                className="w-full min-h-[120px] p-0 border-0 bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 resize-none dark:text-gray-100"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
              
              {previewUrl && (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="max-h-[300px] rounded-lg object-cover w-full" />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
             <div className="flex items-center gap-2 relative">
               <button
                 type="button"
                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
                 title="Add emoji"
               >
                 <Smile size={20} />
               </button>
               
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
                 title="Add image"
               >
                 <ImageIcon size={20} />
               </button>
               <input
                 type="file"
                 className="hidden"
                 ref={fileInputRef}
                 accept="image/*"
                 onChange={handleFileChange}
               />

               {showEmojiPicker && (
                 <div className="absolute top-full left-0 z-10 mt-2">
                   <div className="fixed inset-0 z-0" onClick={() => setShowEmojiPicker(false)} />
                   <div className="relative z-10">
                     <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.AUTO} />
                   </div>
                 </div>
               )}
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
              <Button type="submit" disabled={(!content.trim() && !selectedFile) || isSubmitting} className="min-w-[100px]">
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
