import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const GITHUB_REPO_NAME = "group-buying-app"; // Define repository name
const IS_GITHUB_PAGES = process.env.GITHUB_PAGES === "true"; // Check if building for GitHub Pages

// Initialize next-pwa plugin
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === "development", // Disable PWA in dev is often useful
});

const nextConfig: NextConfig = {
  output: "export", // Enable static export
  reactStrictMode: true,
  // basePath and assetPrefix are needed for GitHub Pages deployment if served from a subdirectory
  basePath: IS_GITHUB_PAGES ? `/${GITHUB_REPO_NAME}` : undefined,
  assetPrefix: IS_GITHUB_PAGES ? `/${GITHUB_REPO_NAME}/` : undefined, // Note the trailing slash for assetPrefix
  
  // Example for images if needed, ensure it's compatible with static export if using external URLs
  // images: {
  //   unoptimized: true, // Required for static export if using next/image with non-standard loaders
  //   loader: 'custom',
  //   loaderFile: './src/lib/imageLoader.ts', // Example custom loader
  // },

  // Ensure environment variables are available client-side if needed
  // env: {
  //   NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // },
};

export default withPWA(nextConfig);
