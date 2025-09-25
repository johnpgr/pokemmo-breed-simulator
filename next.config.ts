import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
}

export default config
