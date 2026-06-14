import type { NextConfig } from "next";

// Allow outbound HTTPS through corporate/school network proxies that intercept TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig: NextConfig = {};

export default nextConfig;
