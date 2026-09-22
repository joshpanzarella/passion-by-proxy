import type { NextConfig } from "next";

// Every page is static, so the build is plain files in out/: Cloudflare
// serves them directly, with no server code to run or configure.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
