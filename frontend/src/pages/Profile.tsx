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

    const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview');
    
    // ... handling user data ...

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">User not found</div>;

    const isOwnProfile = currentUser?.username === profile.username;

    return (
        <div className="mx-auto max-w-4xl space-y-6 pb-12">
            {/* Profile Header */}
            <Card className="overflow-hidden border-none shadow-lg dark:shadow-none">
                <div className="h-48 bg-gradient-to-r from-accent-blue/80 to-accent-violet/80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>
                <div className="px-6 pb-6 relative bg-white dark:bg-charcoal">
                    <div className="flex flex-col sm:flex-row justify-between items-end -mt-16 mb-6 gap-4">
                        <div className="relative group">
                             <Avatar 
                                 src={profile.avatarUrl} 
                                 alt={profile.name} 
                                 size="xl" 
                                 className="ring-4 ring-white dark:ring-charcoal shadow-xl h-32 w-32 text-4xl bg-midnight" 
                            />
                        </div>
                        <div className="flex-1 mb-1 pt-16 sm:pt-0">
                             <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {profile.name}
                                {/* Verified badge placeholder */}
                                <div className="h-5 w-5 rounded-full bg-accent-blue text-white flex items-center justify-center text-[10px]">✓</div>
                             </h1>
                             <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">@{profile.username}</p>
                        </div>
                        <div className="mb-1 shrink-0">
                            {isOwnProfile ? (
                                 <Button variant="outline" className="rounded-full">Edit Profile</Button> 
                             ) : (
                                  <Button 
                                    className="rounded-full px-8"
                                    variant={profile.isFollowing ? "outline" : "primary"}
                                    onClick={handleFollow}
                                  >
                                    {profile.isFollowing ? "Unfollow" : "Follow"}
                                  </Button>
                             )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {profile.bio && (
                            <p className="text-gray-700 dark:text-gray-300 max-w-2xl text-lg leading-relaxed">{profile.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                             <div className="flex items-center gap-2">
                                 <Calendar className="h-4 w-4" />
                                 Joined {new Date(profile.createdAt).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-2">
                                 <MapPin className="h-4 w-4" />
                                 San Francisco, CA {/* Placeholder */}
                             </div>
                             <div className="flex items-center gap-2">
                                 <LinkIcon className="h-4 w-4" />
                                 <a href="#" className="hover:text-accent-blue transition-colors">github.com/{profile.username}</a>
                             </div>
                        </div>

                        <div className="flex gap-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                             <button className="text-center sm:text-left hover:opacity-75 transition-opacity">
                                 <span className="block font-bold text-lg text-gray-900 dark:text-white">{profile._count.posts}</span>
                                 <span className="text-sm text-gray-500">Posts</span>
                             </button>
                             <button className="text-center sm:text-left hover:opacity-75 transition-opacity">
                                 <span className="block font-bold text-lg text-gray-900 dark:text-white">{profile._count.followers}</span>
                                 <span className="text-sm text-gray-500">Followers</span>
                             </button>
                             <button className="text-center sm:text-left hover:opacity-75 transition-opacity">
                                 <span className="block font-bold text-lg text-gray-900 dark:text-white">{profile._count.following}</span>
                                 <span className="text-sm text-gray-500">Following</span>
                             </button>
                        </div>
                    </div>
                </div>
            </Card>
            
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
                 <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 text-sm font-semibold transition-colors relative ${activeTab === 'overview' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                 >
                     Overview
                     {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue"></div>}
                 </button>
                 <button 
                    onClick={() => setActiveTab('projects')}
                    className={`pb-4 px-2 text-sm font-semibold transition-colors relative ${activeTab === 'projects' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                 >
                     Projects
                     {activeTab === 'projects' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue"></div>}
                 </button>
            </div>

            {activeTab === 'overview' ? (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                         <Card className="p-6">
                             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contribution Activity</h3>
                             <div className="h-32 flex items-end gap-1 opacity-50">
                                 {/* Fake activity graph */}
                                 {Array.from({ length: 40 }).map((_, i) => (
                                     <div key={i} className="flex-1 bg-accent-green rounded-t-sm" style={{ height: `${Math.random() * 100}%`, opacity: Math.random() }}></div>
                                 ))}
                             </div>
                         </Card>
                         
                         <h3 className="font-bold text-gray-900 dark:text-white">Latest Posts</h3>
                         {posts.length > 0 ? (
                             <div className="grid gap-4">
                                 {posts.map(post => (
                                      <Card key={post.id} className="p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 group cursor-pointer border-gray-100 dark:border-gray-800">
                                          <div className="flex justify-between items-start mb-2">
                                              <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                                          </div>
                                          <p className="text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors">{post.content}</p>
                                     </Card>
                                 ))}
                             </div>
                         ) : (
                             <div className="text-center py-10 bg-white dark:bg-charcoal rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
                                 <p className="text-gray-500">No recent activity.</p>
                             </div>
                         )}
                    </div>
                    
                    <div className="space-y-6">
                        <Card className="p-6">
                             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                             <div className="flex flex-wrap gap-2">
                                 {['React', 'TypeScript', 'Node.js', 'Tailwind', 'PostgreSQL'].map(skill => (
                                     <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                         {skill}
                                     </span>
                                 ))}
                             </div>
                        </Card>
                        
                        <Card className="p-6">
                             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Achievements</h3>
                             <div className="grid grid-cols-4 gap-2">
                                 {[1, 2, 3, 4].map(i => (
                                     <div key={i} className="aspect-square rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-80" />
                                 ))}
                             </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-charcoal/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                     <p className="text-gray-500 font-medium">No projects showcasing yet.</p>
                </div>
            )}
        </div>
    );
};
