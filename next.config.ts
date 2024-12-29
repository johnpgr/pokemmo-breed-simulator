import MillionLint from "@million/lint";
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        reactCompiler: true,
    },
}

export default MillionLint.next({
    enabled: true,
    rsc: true
})(nextConfig);
