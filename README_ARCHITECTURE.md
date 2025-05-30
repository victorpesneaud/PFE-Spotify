# Spotifind Architecture Documentation

## Project Overview
Spotifind is a web application that helps users discover and manage music. The project follows a modern client-server architecture with a Vue.js frontend and Node.js backend.

## Directory Structure

```
spotifind/
├── backend/                 # Backend server code
│   ├── config/             # Configuration files
│   ├── models/             # Database models
│   └── server.js           # Main server entry point
│
├── src/                    # Frontend source code
│   ├── assets/            # Static assets (images, styles)
│   ├── components/        # Reusable Vue components
│   ├── pages/            # Page components
│   ├── router/           # Vue Router configuration
│   ├── stores/           # State management (Pinia stores)
│   ├── App.vue           # Root Vue component
│   └── main.js           # Frontend entry point
│
├── public/                # Public static files
├── node_modules/         # Dependencies
└── package.json          # Project configuration
```

## Technology Stack

### Frontend
- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: CSS/SCSS

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Database**: MongoDB (based on models directory)
- **Authentication**: JWT (implied by server.js)

## Key Components

### Frontend Architecture
1. **Components**
   - Reusable UI components in `src/components/`
   - Page-level components in `src/pages/`
   - Root application component in `App.vue`

2. **State Management**
   - Pinia stores in `src/stores/`
   - Manages application state and data flow

3. **Routing**
   - Vue Router configuration in `src/router/`
   - Handles client-side navigation

### Backend Architecture
1. **Server**
   - Express.js server in `server.js`
   - Handles API endpoints and business logic

2. **Models**
   - Database models in `backend/models/`
   - Defines data structure and relationships

3. **Configuration**
   - Environment and application configs in `backend/config/`

## Data Flow
1. Client makes request to backend API
2. Server processes request through appropriate routes
3. Database operations performed through models
4. Response sent back to client
5. Frontend updates state and UI accordingly

## Security
- JWT-based authentication
- Environment variables for sensitive data
- CORS configuration for API security

## Development Workflow
1. Frontend development using Vite dev server
2. Backend development using Node.js
3. API integration between frontend and backend
4. Database management through MongoDB

## Deployment
- Frontend: Static file hosting
- Backend: Node.js server hosting
- Database: MongoDB hosting
