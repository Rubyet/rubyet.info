# Backend Health Check Indicator

## Overview
A visual status indicator in the navbar that monitors backend availability in real-time.

## Features

### Status Colors
- 🟢 **Green**: All backend services are operational
  - `/api/health` endpoint responds successfully
  - `/api/posts` endpoint responds successfully
  
- 🟡 **Yellow**: Health check in progress
  - Checking backend status
  - Transitional state during startup
  
- 🔴 **Red**: Backend service unavailable
  - Server not responding
  - Network timeout (5 seconds)
  - API errors

## Implementation

### Files Created/Modified

1. **`services/healthService.js`**
   - `checkBackendHealth()`: Tests multiple critical endpoints
   - 5-second timeout for requests
   - Returns status: 'green', 'yellow', or 'red'

2. **`components/Navbar/Navbar.jsx`**
   - Added health status state
   - Health check runs on component mount
   - Automatic re-check every 30 seconds
   - Visual indicator with tooltip

3. **`components/Navbar/Navbar.css`**
   - Pulsing animation for each status
   - Glowing shadow effects
   - Smooth color transitions

## Behavior

### Initial Load
- Status starts as **yellow** (checking)
- Performs immediate health check
- Updates to green/red based on result

### Periodic Checks
- Runs every 30 seconds automatically
- Non-blocking background operation
- Updates indicator without page refresh

### User Experience
- Hover over indicator to see status tooltip
- No interaction required - purely informational
- Subtle animations indicate active monitoring

## Configuration

### Monitored Endpoints
```javascript
const endpoints = [
  `${API_BASE_URL}/health`,
  `${API_BASE_URL}/posts`,
];
```

### Check Interval
```javascript
const interval = setInterval(performHealthCheck, 30000); // 30 seconds
```

### Request Timeout
```javascript
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds
```

## Customization

To adjust the health check behavior, modify:

- **Check frequency**: Change interval time in `Navbar.jsx`
- **Timeout duration**: Change timeout in `healthService.js`
- **Monitored endpoints**: Add/remove endpoints in `checkBackendHealth()`
- **Indicator size/position**: Adjust CSS in `Navbar.css`

## Status Logic

```
All endpoints OK (2/2)     → GREEN
Some endpoints OK (1/2)    → YELLOW
No endpoints OK (0/2)      → RED
Network error/timeout      → RED
```

## Notes

- Health checks are silent - no console logs on success
- Errors are logged to console for debugging
- Uses `AbortController` for request cancellation
- Indicator appears on all pages with navbar
