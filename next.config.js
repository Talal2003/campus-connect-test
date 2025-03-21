/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for GitHub Pages deployment
  // output: 'export', // Uncomment this line for GitHub Pages deployment
  
  // Disable image optimization for static exports
  // images: {
  //   unoptimized: true, // Uncomment this line for GitHub Pages deployment
  // },
  
  // For local development, keep these settings commented out
  // When you're ready to deploy to GitHub Pages, uncomment the above settings
  
  // Add rewrites for API requests during development (optional)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 