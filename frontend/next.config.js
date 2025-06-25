/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    // Helps with monorepo builds
    externalDir: true,
  },
  // Ensure proper module resolution
  webpack: (config, { isServer }) => {
    // Resolve modules from the frontend directory
    config.resolve.modules = ['node_modules', './src'];
    return config;
  },
};

export default config;
