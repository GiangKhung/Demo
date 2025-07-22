const axios = require('axios');

// Test script để kiểm tra API endpoints
const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test123456'
};

let authToken = '';
let testDocumentId = '';

// Helper function để log kết quả
const logResult = (testName, success, data = null, error = null) => {
  console.log(`\n${success ? '✅' : '❌'} ${testName}`);
  if (success && data) {
    console.log('   Response:', JSON.stringify(data, null, 2));
  }
  if (!success && error) {
    console.log('   Error:', error.message);
  }
};

// Test health endpoint
const testHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE}/../health`);
    logResult('Health Check', true, response.data);
    return true;
  } catch (error) {
    logResult('Health Check', false, null, error);
    return false;
  }
};

// Test user registration
const testRegister = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, testUser);
    authToken = response.data.data.token;
    logResult('User Registration', true, response.data);
    return true;
  } catch (error) {
    logResult('User Registration', false, null, error.response?.data || error);
    return false;
  }
};

// Test user login
const testLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.data.token;
    logResult('User Login', true, response.data);
    return true;
  } catch (error) {
    logResult('User Login', false, null, error.response?.data || error);
    return false;
  }
};

// Test get current user
const testGetMe = async () => {
  try {
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logResult('Get Current User', true, response.data);
    return true;
  } catch (error) {
    logResult('Get Current User', false, null, error.response?.data || error);
    return false;
  }
};

// Test get public documents
const testGetDocuments = async () => {
  try {
    const response = await axios.get(`${API_BASE}/documents`);
    logResult('Get Public Documents', true, response.data);
    return true;
  } catch (error) {
    logResult('Get Public Documents', false, null, error.response?.data || error);
    return false;
  }
};

// Test get user stats
const testGetUserStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logResult('Get User Stats', true, response.data);
    return true;
  } catch (error) {
    logResult('Get User Stats', false, null, error.response?.data || error);
    return false;
  }
};

// Test get user bookmarks
const testGetBookmarks = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users/bookmarks`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logResult('Get User Bookmarks', true, response.data);
    return true;
  } catch (error) {
    logResult('Get User Bookmarks', false, null, error.response?.data || error);
    return false;
  }
};

// Test error handling
const testErrorHandling = async () => {
  try {
    // Test invalid endpoint
    await axios.get(`${API_BASE}/invalid-endpoint`);
    logResult('Error Handling (404)', false);
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      logResult('Error Handling (404)', true, error.response.data);
      return true;
    } else {
      logResult('Error Handling (404)', false, null, error);
      return false;
    }
  }
};

// Test unauthorized access
const testUnauthorized = async () => {
  try {
    await axios.get(`${API_BASE}/users/stats`);
    logResult('Unauthorized Access', false);
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logResult('Unauthorized Access', true, error.response.data);
      return true;
    } else {
      logResult('Unauthorized Access', false, null, error);
      return false;
    }
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'User Registration', fn: testRegister },
    { name: 'User Login', fn: testLogin },
    { name: 'Get Current User', fn: testGetMe },
    { name: 'Get Public Documents', fn: testGetDocuments },
    { name: 'Get User Stats', fn: testGetUserStats },
    { name: 'Get User Bookmarks', fn: testGetBookmarks },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Unauthorized Access', fn: testUnauthorized }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the API configuration.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
