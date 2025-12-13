import { postRepo } from "../post/post.repository"

export const homeService = {
    getFeed() {
        return postRepo.findPublicFeed();
    }
}