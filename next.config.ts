import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: '/.well-known/apple-app-site-association',
                destination: '/.well-known/apple-app-site-association.json',
            },
        ]
    }
};

export default nextConfig;
