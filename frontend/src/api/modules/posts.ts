import client from '../client';

export const postApi = {
  getAll: () => client.get('/home'), // Home feed
  create: (data: any) => client.post('/posts', data),
  getById: (id: string) => client.get(`/posts/${id}`),
  getByUser: (username: string) => client.get(`/posts/user/${username}`),
  like: (id: string) => client.post(`/posts/${id}/like`),
  unlike: (id: string) => client.delete(`/posts/${id}/like`),
};
