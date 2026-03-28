import type { NextConfig } from "next";

import "./src/env.ts";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
