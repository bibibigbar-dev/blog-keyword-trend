/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/blog-keyword-trend" : "",
  assetPrefix: isGitHubPages ? "/blog-keyword-trend/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
