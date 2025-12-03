import { postRepo } from "./post.repository";

export const postService = {
    create: (authorId: string, content: string) =>
        postRepo.create(authorId, content),

    findAll: () => postRepo.findAll(),

    findOne: (id: string) => postRepo.findOne(id),
}