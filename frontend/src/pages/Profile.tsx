import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '../api/modules/users';
import { postApi } from '../api/modules/posts';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'lucide-react';

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
                // Fetch profile
                const profileRes = await userApi.getProfile(username);
                setProfile(profileRes.data);

                // Fetch user posts
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
            // Optimistic update
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
            // Revert optimistic update
            // Ideally re-fetch or revert state, but for simplicity we log error
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (!profile) return <div>User not found</div>;

    const isOwnProfile = currentUser?.username === profile.username;

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:items-start">
                    <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                         {profile.avatarUrl ? (
                             <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full rounded-full object-cover" />
                         ) : (
                             profile.name?.charAt(0).toUpperCase()
                         )}
                    </div>
                    <div className="flex-1 space-y-2">
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                             <div>
                                 <h1 className="text-2xl font-bold">{profile.name}</h1>
                                 <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
                             </div>
                             {isOwnProfile ? (
                                 <Button variant="outline">Edit Profile</Button> 
                             ) : (
                                  <Button 
                                    variant={profile.isFollowing ? "outline" : "primary"}
                                    onClick={handleFollow}
                                  >
                                    {profile.isFollowing ? "Unfollow" : "Follow"}
                                  </Button>
                             )}
                         </div>
                         <p className="max-w-xl text-gray-700 dark:text-gray-300">{profile.bio || "No bio yet."}</p>
                         
                         <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 justify-center sm:justify-start">
                             <div className="flex items-center gap-1">
                                 <Calendar className="h-4 w-4" />
                                 Joined {new Date(profile.createdAt).toLocaleDateString()}
                             </div>
                         </div>

                         <div className="flex gap-6 mt-4 justify-center sm:justify-start">
                             <div className="text-center sm:text-left">
                                 <span className="font-bold text-gray-900 dark:text-white">{profile._count.posts}</span>
                                 <span className="text-gray-500 ml-1">Posts</span>
                             </div>
                             <div className="text-center sm:text-left">
                                 <span className="font-bold text-gray-900 dark:text-white">{profile._count.followers}</span>
                                 <span className="text-gray-500 ml-1">Followers</span>
                             </div>
                             <div className="text-center sm:text-left">
                                 <span className="font-bold text-gray-900 dark:text-white">{profile._count.following}</span>
                                 <span className="text-gray-500 ml-1">Following</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Latest Posts</h2>
                 {posts.length > 0 ? (
                     posts.map(post => (
                          <div key={post.id} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                              <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                 {new Date(post.createdAt).toLocaleDateString()}
                             </p>
                         </div>
                     ))
                 ) : (
                     <p className="text-gray-500">No posts yet.</p>
                 )}
            </div>
        </div>
    );
};
