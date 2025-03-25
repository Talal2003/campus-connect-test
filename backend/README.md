# Campus Connect Backend

This is the backend API for the UT Campus Connect lost and found application.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Database Setup
1. Install PostgreSQL on your system if you haven't already.
2. Create a new PostgreSQL database:
   ```
   CREATE DATABASE campus_connect;
   ```
3. Update the `.env` file with your PostgreSQL credentials.

### Environment Configuration
1. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3001
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=campus_connect
   DB_PASSWORD=your_postgresql_password
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   ```

### Port Forwarding
For development environments or when the frontend is hosted separately from the backend:

1. The backend runs on port 3001 by default
2. If you need to use port forwarding to access the API:
   - Setup your port forwarding to map a public-facing port to port 3001
   - Update the `NEXT_PUBLIC_API_URL` in the frontend's `.env.local` to point to your forwarded URL
   - Example: `NEXT_PUBLIC_API_URL=https://your-domain.com/api`

### Installation
1. Install dependencies:
   ```
   npm install
   ```

2. Initialize the database:
   ```
   node scripts/init-db.js
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (requires authentication)

### Items
- `POST /api/items` - Create a new item (requires authentication)
- `GET /api/items` - Get all items (with optional filters)
- `GET /api/items/my-items` - Get current user's items (requires authentication)

## Troubleshooting

If you encounter "Server error during registration" or other database connection issues:

1. Ensure PostgreSQL is running
2. Verify your database credentials in the `.env` file
3. Check that the database exists and is accessible
4. Run the initialization script again: `node scripts/init-db.js`
5. Check server logs for specific error messages 