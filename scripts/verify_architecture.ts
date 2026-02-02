import { spawn } from 'child_process';
import http from 'http';

const SERVER_PORT = 3000;
const BASE_URL = `http://localhost:${SERVER_PORT}`;

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(path: string, options: http.RequestOptions, body?: any): Promise<{ statusCode?: number; data: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    // Correcting path to include global prefix if not present (script usage)
    // Actually, let's just update the calls in runVerification
    const req = http.request(`${BASE_URL}${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: data ? JSON.parse(data) : null, headers: res.headers });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => {
        // console.error('Request error:', err);
        resolve({ statusCode: 0, data: { error: err.message }, headers: {} });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('Starting server...');
  const server = spawn('npm', ['run', 'start'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(SERVER_PORT) },
    stdio: ['ignore', 'pipe', 'pipe'] // Capture stdout/stderr
  });

  let serverOutput = '';
  server.stdout.on('data', (data) => {
    const chunk = data.toString();
    serverOutput += chunk;
    console.log('[SERVER]:', chunk); // Uncommented for debugging
    if (chunk.includes('Nest application successfully started')) {
        // Signal ready? We'll just wait a bit.
    }
  });

  server.stderr.on('data', (data) => {
      console.error('[SERVER ERR]:', data.toString());
  });

  console.log('Waiting for server to initialize...');
  // Poll until server is up
  let retries = 20;
  while (retries > 0) {
      try {
          const res = await makeRequest('/api/v1', { method: 'GET' });
          if (res.statusCode !== 0) break;
          await wait(2000);
          retries--;
          console.log('Waiting...');
      } catch (e) {
          await wait(2000);
          retries--;
          if (retries === 0) {
              console.error('Server failed to start');
              server.kill();
              process.exit(1);
          }
      }
  }
  console.log('Server is up!');

  let failed = false;

  // 1. Test Guard (Invalid Key)
  console.log('\n--- Testing Guard (Invalid Key) ---');
  const guardRes = await makeRequest('/api/v1/users/123', {
      method: 'GET',
      headers: { 'x-api-key': 'wrong-key' }
  });
  if (guardRes.statusCode === 401) {
      console.log('✅ Guard blocked invalid key');
  } else {
      console.log('❌ Guard failed to block invalid key. Status:', guardRes.statusCode);
      failed = true;
  }

  // 2. Test Pipe (Invalid Input)
  console.log('\n--- Testing Pipe (Validation) ---');
  const pipeRes = await makeRequest('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
  }, { username: 123, email: 'bad-email' }); // Username should be string
  
  if (pipeRes.statusCode === 400) {
      console.log('✅ Pipe caught invalid input (400 Bad Request)');
  } else {
      console.log('❌ Pipe failed. Status:', pipeRes.statusCode, pipeRes.data);
      failed = true;
  }

  // 3. Test Interceptor (Response Format)
  console.log('\n--- Testing Interceptor (Transform) ---');
  // We need a valid call. Assuming /users doesn't need DB write to succeed in controller (it's a mock return)
  const interceptorRes = await makeRequest('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
  }, { username: 'testuser', email: 'test@example.com' });

  if (interceptorRes.data && interceptorRes.data.data && interceptorRes.data.data.data && interceptorRes.data.data.data.username === 'testuser') {
      console.log('✅ Interceptor wrapped response in { data: ... }');
  } else {
      console.log('❌ Interceptor failed format.', interceptorRes.data);
      failed = true;
  }

  // 4. Test Middleware (Logs)
  console.log('\n--- Testing Middleware (Logging) ---');
  // Check if server output contains logs for previous requests
  // We need to wait a bit for flush
  await wait(1000);
  if (serverOutput.includes('POST /api/v1/users 201') || serverOutput.includes('POST /api/v1/users 400')) {
       console.log('✅ Middleware logged requests');
  } else {
      console.log('❌ Middleware logs not found in stdout.');
      // console.log('Full Output:\n', serverOutput);
      failed = true;
  }

  console.log('\nStopped Server.');
  server.kill();
  process.exit(failed ? 1 : 0);
}

runVerification();
