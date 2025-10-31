# Backend Health Check Indicator

## Overview
The logo dot (.) in the navbar serves as a visual status indicator that monitors backend availability in real-time.

## Features

### Status Colors
- 🟢 **Green**: All backend services are operational
  - `/api/health` endpoint responds successfully
  - `/api/posts` endpoint responds successfully
  - Subtle green glow effect
  
- 🟡 **Yellow**: Health check in progress
  - Checking backend status
  - Pulsing animation
  - Transitional state during startup
  
- 🔴 **Red**: Backend service unavailable
  - Server not responding
  - Network timeout (5 seconds)
  - API errors
  - Slow pulsing fade effect

## Design

The logo dot changes color and animation based on backend health:

```
Rubyet.
      ↑
   Health indicator (changes color)
```

- **Normal state**: Purple gradient (default)
- **Green (healthy)**: Green with glow, steady
- **Yellow (checking)**: Orange with scaling pulse
- **Red (error)**: Red with opacity fade

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
   - Logo dot changes color based on status
   - Framer Motion animations for pulsing effects
   - Tooltip shows status on hover

3. **`components/Navbar/Navbar.css`**
   - Health status color classes
   - Glowing text-shadow effects
   - Smooth color transitions
   - Integrated into logo-dot styling

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
- Hover over the logo dot to see status tooltip
- No interaction required - purely informational
- Subtle animations indicate active monitoring
- Integrated seamlessly into existing logo design
- No separate indicator cluttering the UI

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
- **Animation style**: Adjust Framer Motion settings in logo-dot
- **Colors**: Modify `.logo-dot.health-*` classes in `Navbar.css`
- **Glow intensity**: Adjust `text-shadow` values in CSS

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
- Logo dot appears on all pages with navbar
- Animations powered by Framer Motion
- Hover tooltip provides detailed status information
