import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '../api/modules/users';
import { postApi } from '../api/modules/posts';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  isFollowing?: boolean;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
}

export const Profile = () => {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [posts, setPosts] = useState<any[]>([]); // Define correct type
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return;
            try {
                const profileRes = await userApi.getProfile(username);
                setProfile(profileRes.data);

                const postsRes = await postApi.getByUser(username);
                setPosts(postsRes.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const handleFollow = async () => {
        if (!profile || !currentUser) return;
        
        try {
            const isFollowing = profile.isFollowing;
            setProfile(prev => prev ? {
                ...prev,
                isFollowing: !isFollowing,
                _count: {
                    ...prev._count,
                    followers: prev._count.followers + (isFollowing ? -1 : 1)
                }
            } : null);

            if (isFollowing) {
                await userApi.unfollow(profile.id);
            } else {
                await userApi.follow(profile.id);
            }
        } catch (error) {
            console.error("Failed to update follow status", error);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">User not found</div>;

    const isOwnProfile = currentUser?.username === profile.username;

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Card className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary-500 to-indigo-600"></div>
                <div className="px-6 pb-6 relative">
                    <div className="flex justify-between items-end -mt-12 mb-4">
                        <Avatar 
                             src={profile.avatarUrl} 
                             alt={profile.name} 
                             size="xl" 
                             className="ring-4 ring-white dark:ring-gray-900 shadow-md h-24 w-24 sm:h-32 sm:w-32 text-4xl" 
                        />
                        <div className="mb-1">
                            {isOwnProfile ? (
                                 <Button variant="outline" size="sm">Edit Profile</Button> 
                             ) : (
                                  <Button 
                                    variant={profile.isFollowing ? "outline" : "primary"}
                                    onClick={handleFollow}
                                  >
                                    {profile.isFollowing ? "Unfollow" : "Follow"}
                                  </Button>
                             )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">@{profile.username}</p>
                        </div>
                        
                        {profile.bio && (
                            <p className="text-gray-700 dark:text-gray-300 max-w-2xl">{profile.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                             <div className="flex items-center gap-1.5">
                                 <Calendar className="h-4 w-4" />
                                 Joined {new Date(profile.createdAt).toLocaleDateString()}
                             </div>
                             {/* Placeholder for location/website if added later */}
                        </div>

                        <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                             <div className="text-center sm:text-left">
                                 <span className="block font-bold text-xl text-gray-900 dark:text-white">{profile._count.posts}</span>
                                 <span className="text-sm text-gray-500">Posts</span>
                             </div>
                             <div className="text-center sm:text-left">
                                 <span className="block font-bold text-xl text-gray-900 dark:text-white">{profile._count.followers}</span>
                                 <span className="text-sm text-gray-500">Followers</span>
                             </div>
                             <div className="text-center sm:text-left">
                                 <span className="block font-bold text-xl text-gray-900 dark:text-white">{profile._count.following}</span>
                                 <span className="text-sm text-gray-500">Following</span>
                             </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                 {posts.length > 0 ? (
                     <div className="grid gap-4">
                         {posts.map(post => (
                              <Card key={post.id} className="p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                                  <p className="text-xs text-gray-500 mt-3">
                                     {new Date(post.createdAt).toLocaleDateString()}
                                 </p>
                             </Card>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-200">
                         <p className="text-gray-500">No posts yet.</p>
                     </div>
                 )}
            </div>
        </div>
    );
};
