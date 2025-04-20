import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    async headers() {
        return [
            {
                // Apply this only to the .well-known/apple-app-site-association file
                source: '/.well-known/apple-app-site-association',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/json',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
