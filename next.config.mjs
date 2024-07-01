/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "dist",
    compress: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
