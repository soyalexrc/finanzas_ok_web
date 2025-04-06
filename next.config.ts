import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // async rewrites() {
    //     return [
    //         {
    //             source: '/.well-known/apple-app-site-association',
    //             destination: '/.well-known/apple-app-site-association.json',
    //         },
    //     ]
    // },


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
