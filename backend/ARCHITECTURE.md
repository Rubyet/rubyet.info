# Backend API - Structured Architecture

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── constants.js     # Application constants
│   └── database.js      # Database initialization
├── controllers/         # Business logic
│   ├── postController.js
│   └── contactController.js
├── middleware/          # Custom middleware
│   ├── asyncHandler.js  # Async error handler
│   └── errorHandler.js  # Global error handling
├── models/              # Data access layer
│   ├── postModel.js
│   └── contactModel.js
├── routes/              # API routes
│   ├── apiRoutes.js
│   ├── postRoutes.js
│   └── contactRoutes.js
├── utils/               # Utility functions
│   └── helpers.js       # Helper functions
├── data/                # JSON data files
│   ├── posts.json
│   ├── contacts.json
│   └── analytics.json
├── server.js            # Application entry point
├── package.json
└── .env
```

## 🏗️ Architecture Pattern

This backend follows the **MVC (Model-View-Controller)** pattern with clear separation of concerns:

### 1. **Models** (`models/`)
- Handle all data operations (CRUD)
- Interact with JSON files
- Return data to controllers

### 2. **Controllers** (`controllers/`)
- Contain business logic
- Process requests
- Call models for data operations
- Send responses

### 3. **Routes** (`routes/`)
- Define API endpoints
- Map URLs to controller functions
- Apply middleware

### 4. **Middleware** (`middleware/`)
- Error handling
- Async wrapper for error catching
- Request validation (future)

### 5. **Config** (`config/`)
- Application configuration
- Database initialization
- Constants and environment variables

### 6. **Utils** (`utils/`)
- Reusable helper functions
- Slug generation
- Date formatting
- Reading time calculation

## 🚀 API Endpoints

### Posts
```
GET    /api/posts                  # Get all posts
GET    /api/posts/id/:id           # Get post by ID
GET    /api/posts/slug/:slug       # Get post by slug
GET    /api/posts/search           # Search posts
GET    /api/posts/tag/:tag         # Get posts by tag
GET    /api/posts/:id/related      # Get related posts
POST   /api/posts                  # Create new post
POST   /api/posts/:id/view         # Increment post views
PUT    /api/posts/:id              # Update post
DELETE /api/posts/:id              # Delete post
```

### Contacts
```
GET    /api/contacts               # Get all contacts
GET    /api/contacts/:id           # Get contact by ID
GET    /api/contacts/stats         # Get contact statistics
POST   /api/contacts               # Create contact submission
PUT    /api/contacts/:id           # Update contact status
DELETE /api/contacts/:id           # Delete contact
```

### Other
```
GET    /api/health                 # Health check
GET    /api/statistics             # Get post statistics
GET    /api/tags                   # Get all tags
GET    /api/export                 # Export all posts
POST   /api/import                 # Import posts
```

## 🔧 Setup & Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
```

3. Start server:
```bash
# Development
npm start

# Production
NODE_ENV=production node server.js
```

## 📦 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **uuid** - Unique ID generation
- **dotenv** - Environment variables

## 🎯 Best Practices Implemented

### 1. **Separation of Concerns**
- Each layer has a single responsibility
- Easy to maintain and test

### 2. **Error Handling**
- Async error wrapper prevents try-catch blocks in every route
- Global error handler for consistent error responses
- 404 handler for undefined routes

### 3. **Code Reusability**
- Utility functions for common operations
- Models handle all data operations
- Controllers are lean and focused

### 4. **Maintainability**
- Clear folder structure
- Consistent naming conventions
- JSDoc comments for documentation

### 5. **Scalability**
- Easy to add new routes/controllers
- Modular architecture
- Can easily switch from JSON to database

## 🔄 Adding New Features

### Add a new endpoint:

1. **Create Model** (if needed)
```javascript
// models/newModel.js
class NewModel {
  async findAll() { /* ... */ }
}
module.exports = new NewModel();
```

2. **Create Controller**
```javascript
// controllers/newController.js
exports.getAll = async (req, res) => {
  const data = await newModel.findAll();
  res.json(data);
};
```

3. **Create Route**
```javascript
// routes/newRoutes.js
router.get('/', asyncHandler(newController.getAll));
```

4. **Register in server.js**
```javascript
app.use('/api/new', newRoutes);
```

## 📝 Code Quality

- **Async/Await** - Modern async handling
- **Error Handling** - Comprehensive error management
- **Comments** - JSDoc style documentation
- **Consistency** - Uniform code style

## 🚀 Future Improvements

- [ ] Add request validation middleware
- [ ] Implement authentication middleware
- [ ] Add rate limiting
- [ ] Add logging middleware (Morgan/Winston)
- [ ] Add API documentation (Swagger)
- [ ] Add unit tests (Jest)
- [ ] Add database support (MongoDB/PostgreSQL)
- [ ] Add caching layer (Redis)

## 📊 Performance

- Async operations for non-blocking I/O
- Efficient file operations
- Minimal middleware overhead
- Optimized data structures

## 🔒 Security Considerations

- CORS enabled
- Request size limits
- Input sanitization (to be added)
- Authentication (to be added)
- Rate limiting (to be added)

---

**Maintained by:** Rubyet Hossain  
**Last Updated:** October 2025
