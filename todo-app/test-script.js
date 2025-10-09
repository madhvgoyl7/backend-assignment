// Test Script - Run this in browser console after opening http://localhost:3000

console.log('🧪 Starting Todo App Tests...\n');

const BASE_URL = 'http://localhost:5001';
const testUsername = 'testuser' + Date.now();
const testPassword = 'password123';

async function runTests() {
  try {
    // Test 1: Signup
    console.log('1️⃣ Testing Signup...');
    const signupRes = await fetch(`${BASE_URL}/api/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: testPassword })
    });
    const signupData = await signupRes.json();
    console.log('✅ Signup:', signupData);

    // Test 2: Login
    console.log('\n2️⃣ Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: testPassword })
    });
    const loginData = await loginRes.json();
    console.log('✅ Login:', loginData);

    // Check cookies
    console.log('\n🍪 Cookies:', document.cookie);

    // Test 3: Check Session
    console.log('\n3️⃣ Testing Session Check...');
    const sessionRes = await fetch(`${BASE_URL}/api/check-session`, {
      credentials: 'include'
    });
    const sessionData = await sessionRes.json();
    console.log('✅ Session:', sessionData);

    // Test 4: Create Task 1
    console.log('\n4️⃣ Testing Create Task 1...');
    const task1Res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Task 1' })
    });
    const task1Data = await task1Res.json();
    console.log('✅ Task 1:', task1Data);

    // Test 5: Create Task 2 (This is where error usually happens)
    console.log('\n5️⃣ Testing Create Task 2...');
    const task2Res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Task 2' })
    });
    const task2Data = await task2Res.json();
    
    if (task2Res.status === 401) {
      console.error('❌ FAILED: Got Unauthorized on Task 2!');
      console.error('Response:', task2Data);
      return false;
    }
    
    console.log('✅ Task 2:', task2Data);

    // Test 6: Get All Tasks
    console.log('\n6️⃣ Testing Get Tasks...');
    const tasksRes = await fetch(`${BASE_URL}/api/tasks`, {
      credentials: 'include'
    });
    const tasksData = await tasksRes.json();
    console.log('✅ All Tasks:', tasksData);

    console.log('\n🎉 ALL TESTS PASSED! 🎉');
    return true;

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    return false;
  }
}

// Run the tests
runTests();
