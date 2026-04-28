import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SNOW_INSTANCE: process.env.SNOW_INSTANCE,
    SNOW_USERNAME: process.env.SNOW_USERNAME,
    SNOW_PASSWORD: process.env.SNOW_PASSWORD
  },
  devIndicators: false
};

export default nextConfig;
