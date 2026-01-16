import client from '../client';

export const authApi = {
  login: (data: any) => client.post('/auth/login', data),
  register: (data: any) => client.post('/auth/register', data),
  logout: () => client.post('/auth/logout'),
  getCurrentUser: () => client.get('/auth/me'), // Assuming this exists or we use profile
};
