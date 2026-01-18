import { postRepo } from "./post.repository";
import { redis } from "../../utils/redis";
import { cacheKeys } from "../../utils/cacheKeys";
import { notificationQueue } from "../../jobs/notification.job";

export const postService = {
  // -------------------- CREATE POST --------------------
  async create(authorId: string, content: string, imageUrl?: string) {
    const post = await postRepo.create(authorId, content, imageUrl);

    // Best-effort invalidation (do NOT depend on relations)
    await Promise.all([
      redis.del(cacheKeys.posts(1, 20)),                 // public feed
      redis.del(cacheKeys.home(authorId, 20)),           // home feed
    ]);

    // Trigger notification fanout (placeholder logic for now, assumes follower notification)
    // For now, we'll just log or maybe trigger a generic "new post" notification if we had logic for it.
    // Since we don't have a follower list fetch here, we might want to do that in the worker.
    // For this step, let's assume we notify followers in the worker.
    // But wait, the worker expects `recipientId`.
    // So we should find followers here OR make the worker handle fanout.
    // The current worker creates ONE notification.
    // So let's just trigger it for a "self" notification for testing, or skip if fanout isn't implemented?
    // User requested "Post Notification Fanout" in plan.
    // But the worker I wrote `notification.job.ts` just does `prisma.notification.create`.
    // So the fanout logic needs to be SOMEWHERE.
    // Let's put the fanout triggers here (getting followers) OR change the job to "fanout-post".
    // Let's keep it simple: We iterate followers here and add jobs? No, that blocks API.
    // Better: Add a "post-created" job, and have a worker that finds followers and adds "create-notification" jobs.
    // But for this specific task "Notification Model", let's just demonstrate 1 notification.
    // Or I can update the plan.
    // Let's add a todo comment or just basic notification to the author confirming post creation? No that's spammy.
    // Let's just leave it ready for the "fanout" implementation which is a separate complexity.
    // Re-reading plan: "Post Notification Fanout: (Placeholder) When a post is created, notify followers."
    // I will add a method to `post.service` to handling generic post creation side effects later.
    // For now, I will NOT add code that doesn't work.
    // I will add the import but maybe not the logic yet if I don't have follower fetching handy.
    // Wait, I can fetch followers efficiently?
    // Let's leave post service changes for the "Integrate" step more fully.
    
    return post;
  },

  // -------------------- GET SINGLE POST --------------------
  async findOne(postId: string) {
    const postKey = cacheKeys.postById(postId);
    const likeCountKey = cacheKeys.likeCountByPost(postId);
    const commentCountKey = cacheKeys.commentCount(postId);

    // 1️⃣ Cache first
    const cached = await redis.get(postKey);
    if (cached) {
      const post = JSON.parse(cached);

      const [likes, comments] = await Promise.all([
        redis.get(likeCountKey),
        redis.get(commentCountKey),
      ]);

      return {
        ...post,
        _count: {
          likes: likes ? Number(likes) : post._count?.likes ?? 0,
          comments: comments ? Number(comments) : post._count?.comments ?? 0,
        },
      };
    }

    // 2️⃣ DB fallback
    const post = await postRepo.findOne(postId);
    if (!post) return null;

    // 3️⃣ Cache immutable post data
    await redis.set(postKey, JSON.stringify(post), "EX", 600);

    // 4️⃣ Prime counts once
    if (post._count) {
      await Promise.all([
        redis.setnx(likeCountKey, String(post._count.likes)),
        redis.setnx(commentCountKey, String(post._count.comments)),
      ]);
    }

    return post;
  },

  // -------------------- POSTS BY USER --------------------
  async findByUserName(username: string, page = 1, limit = 20) {
    const key = cacheKeys.postsByUser(username, page, limit);

    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const posts = await postRepo.findByUserName(username);

    await redis.set(key, JSON.stringify(posts), "EX", 300);

    return posts;
  },

  // -------------------- PUBLIC FEED --------------------
  async findPublicFeed(page = 1, limit = 20) {
    const key = cacheKeys.posts(page, limit);

    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const posts = await postRepo.findPublicFeed();

    await redis.set(key, JSON.stringify(posts), "EX", 60);

    return posts;
  },
};
