// Health Check Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Check backend health status
 * @returns {Promise<'green'|'yellow'|'red'>} Health status
 */
export async function checkHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return 'green'; // All OK
    } else {
      return 'red'; // Server responded but with error
    }
  } catch (error) {
    // Network error, timeout, or server not reachable
    return 'red';
  }
}

/**
 * Check multiple critical routes
 * @returns {Promise<'green'|'yellow'|'red'>} Health status
 */
export async function checkBackendHealth() {
  const endpoints = [
    `${API_BASE_URL}/health`,
    `${API_BASE_URL}/posts`,
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const results = await Promise.allSettled(
      endpoints.map(endpoint =>
        fetch(endpoint, {
          method: 'GET',
          signal: controller.signal,
        })
      )
    );

    clearTimeout(timeoutId);

    // Count successful responses
    const successCount = results.filter(
      result => result.status === 'fulfilled' && result.value.ok
    ).length;

    if (successCount === endpoints.length) {
      return 'green'; // All endpoints OK
    } else if (successCount > 0) {
      return 'yellow'; // Some endpoints OK
    } else {
      return 'red'; // No endpoints OK
    }
  } catch (error) {
    return 'red'; // Network error
  }
}

const healthService = {
  checkHealth,
  checkBackendHealth,
};

export default healthService;
