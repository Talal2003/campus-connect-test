# Campus Connect Frontend

This is the frontend for the Campus Connect application, a lost and found system for university campuses.

## Features

- User authentication (login/register)
- Report lost and found items
- Search and filter items by various criteria
- Responsive design for mobile and desktop
- Integration with backend API

## Technologies Used

- Next.js 13+ (App Router)
- React
- CSS Modules
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server (running locally during development)

### Installation

1. Clone the repository:
   ```
   git clone <your-github-repo-url>
   cd campus-connect-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

### Running the Development Server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This frontend can be deployed to various platforms:

### Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Deploying to GitHub Pages

1. Configure your `next.config.js` for static export:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   
   module.exports = nextConfig
   ```

2. Add a deploy script to your `package.json`:
   ```json
   "scripts": {
     "deploy": "next build && next export && touch out/.nojekyll && gh-pages -d out"
   }
   ```

3. Install the gh-pages package:
   ```
   npm install --save-dev gh-pages
   ```

4. Run the deploy script:
   ```
   npm run deploy
   ```

## Backend API Integration

This frontend is designed to work with a local backend API running on http://localhost:5000. To configure the frontend to work with a different API URL:

1. Update the `NEXT_PUBLIC_API_URL` in your `.env.local` file
2. Rebuild and redeploy the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
