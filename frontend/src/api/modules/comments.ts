import client from '../client';

export const commentApi = {
  create: (postId: string, content: string) => client.post(`/posts/${postId}/comments`, { content }),
  getByPost: (postId: string) => client.get(`/posts/${postId}/comments`),
};
