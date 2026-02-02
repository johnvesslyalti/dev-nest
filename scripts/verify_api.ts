
import { randomBytes } from 'crypto';

const BASE_URL = 'http://localhost:3001/api/v1';

async function main() {
  console.log('Starting Full API Verification...');

  const username = `testuser_${randomBytes(4).toString('hex')}`;
  const email = `${username}@example.com`;
  const password = 'password123';

  console.log(`\nGenerated credentials: ${username} / ${email}`);

  // 1. Register
  console.log('\n--- 1. Registering User ---');
  let res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  
  if (!res.ok) {
    console.error('Registration failed:', await res.text());
    process.exit(1);
  }
  let data = await res.json();
  console.log('Registration success. User ID:', data.id);
  
  let accessToken = data.accessToken;
  const userId = data.id;

  const authHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
  };

  // 2. Login
  console.log('\n--- 2. Logging In ---');
  res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    console.error('Login failed:', await res.text());
    process.exit(1);
  }
  
  data = await res.json();
  console.log('Login success');
  accessToken = data.accessToken;
  // Update headers just in case
  authHeaders['Authorization'] = `Bearer ${accessToken}`;

  // 3. Get Me
  console.log('\n--- 3. Verify Get Me ---');
  res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: authHeaders
  });
  console.log('Get Me:', res.ok ? 'OK' : await res.text());

  // 4. Create Post
  console.log('\n--- 4. Create Post ---');
  res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ content: 'Hello World! This is a test post.' })
  });

  let postId;
  if (!res.ok) {
      console.error('Create Post failed:', await res.text());
      // process.exit(1); // Continue? No, we need postId
      return; 
  } else {
      data = await res.json();
      console.log('Create Post success');
      postId = data.post.id;
  }

  // 5. Get Posts
  console.log('\n--- 5. Get All Posts ---');
  res = await fetch(`${BASE_URL}/posts`, {
      method: 'GET',
      headers: authHeaders
  });
  console.log('Get Posts:', res.ok ? 'OK' : await res.text());

  // --- NEW TESTS ---

  // 6. Profile - Update Bio
  console.log('\n--- 6. Profile: Update Bio ---');
  res = await fetch(`${BASE_URL}/profile/bio`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ bio: 'I am a test user running verification scripts.' })
  });
  if (res.ok) {
      console.log('Update Bio success:', await res.json());
  } else {
      console.error('Update Bio failed:', await res.text());
  }

  // 7. Profile - Get Profile
  console.log('\n--- 7. Profile: Get Profile ---');
  res = await fetch(`${BASE_URL}/profile/${username}`, {
      method: 'GET',
      headers: authHeaders
  });
  if (res.ok) {
      console.log('Get Profile success:', await res.json());
  } else {
      console.error('Get Profile failed:', await res.text());
  }

  // 8. Profile - Search
  console.log('\n--- 8. Profile: Search ---');
  res = await fetch(`${BASE_URL}/profile/search?query=${username}`, {
      method: 'GET',
      headers: authHeaders
  });
  if (res.ok) {
      const searchData = await res.json();
      console.log(`Search success. Found ${searchData.length} users.`);
  } else {
      console.error('Search failed:', await res.text());
  }

  // 9. Comments - Create Comment
  console.log('\n--- 9. Comments: Create ---');
  res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ content: 'This is a test comment.' })
  });
  if (res.ok) {
      console.log('Create Comment success:', await res.json());
  } else {
      console.error('Create Comment failed:', await res.text());
  }

  // 10. Comments - Get Comments
  console.log('\n--- 10. Comments: Get ---');
  res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: authHeaders
  });
  if (res.ok) {
      const comments = await res.json();
      console.log(`Get Comments success. Found ${comments.length} comments.`);
  } else {
      console.error('Get Comments failed:', await res.text());
  }

  // 11. Likes - Like Post
  console.log('\n--- 11. Likes: Like Post ---');
  res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: authHeaders
  });
  if (res.ok) {
      console.log('Like Post success:', await res.json());
  } else {
      console.error('Like Post failed:', await res.text());
  }

  // 12. Likes - Unlike Post
  console.log('\n--- 12. Likes: Unlike Post ---');
  res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: 'DELETE',
      headers: authHeaders
  });
  if (res.ok) {
      console.log('Unlike Post success:', await res.json());
  } else {
      console.error('Unlike Post failed:', await res.text());
  }

  // 13. Logout
  console.log('\n--- 13. Logout ---');
  res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authHeaders
  });
  console.log('Logout:', res.ok ? 'OK' : await res.text());

  console.log('\nFull Verification Complete.');
}

main().catch(err => console.error(err));
