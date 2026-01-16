import client from '../client';

export const userApi = {
  getProfile: (username: string) => client.get(`/profile/${username}`),
  updateProfile: (data: any) => client.put('/profile', data), // Checking route assumption
  follow: (id: string) => client.post(`/follow/${id}`),
  unfollow: (id: string) => client.delete(`/follow/${id}`),
  getFollowers: (id: string) => client.get(`/follow/${id}/followers`),
  getFollowing: (id: string) => client.get(`/follow/${id}/following`),
};
