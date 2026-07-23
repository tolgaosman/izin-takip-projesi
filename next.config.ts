import type { NextConfig } from "next";

// GitHub Pages serves this project site under the repo name.
// Apply the prefix only for production builds so local `next dev`
// keeps working at the root ("/") instead of 404-ing.
const basePath =
  process.env.NODE_ENV === "production" ? "/staff-leave-tracker-frontend" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
