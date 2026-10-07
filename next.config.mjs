/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1440, 1920],
  },
  async redirects() {
    // The previous site's routes, kept alive so existing links and indexed
    // pages land on their replacement rather than on a 404.
    return [
      { source: "/work", destination: "/projets", permanent: true },
      { source: "/work/:slug", destination: "/projets/:slug", permanent: true },
      { source: "/parcours", destination: "/about", permanent: true },
      { source: "/lab", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
