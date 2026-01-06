export const cacheKeys = {
    // -------------------- Profiles --------------------
    profileByUsername: (username) => `profile:username:${username}`,
    profileByUserId: (userId) => `profile:user:${userId}`,
    followers: (userId) => `followers:${userId}`,
    following: (userId) => `following:${userId}`,
    // -------------------- Posts --------------------
    // Single post (hot read)
    postById: (postId) => `post:${postId}`,
    // Posts by user (profile page)
    postsByUser: (username, page, limit) => `posts:user:${username}:page:${page}:limit:${limit}`,
    // Global posts (explore / latest)
    posts: (page, limit) => `posts:page:${page}:limit:${limit}`,
    // Home feed (personalized)
    home: (userId, limit, cursor) => `feed:home:user:${userId}:limit:${limit}:cursor:${cursor || "first"}`,
    // -------------------- Likes --------------------
    // Like count per post (VERY IMPORTANT)
    likeCountByPost: (postId) => `likes:count:post:${postId}`,
    // Did user like a post? (short TTL only)
    userLikedPost: (userId, postId) => `likes:user:${userId}:post:${postId}`,
    // -------------------- Comments --------------------
    commentsByPost: (postId, page, limit) => `comments:post:${postId}:page:${page}:limit:${limit}`,
    commentCount: (postId) => `comments:count:post:${postId}`,
    commentById: (commentId) => `comment:${commentId}`,
};
