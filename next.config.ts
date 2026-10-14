import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const strapiPattern = (url: URL): RemotePattern => ({
  protocol: url.protocol === "https:" ? "https" : "http",
  hostname: url.hostname,
  port: url.port,
  pathname: "/uploads/**",
});

// Strapi local (dev) + a URL pública do Strapi em produção (NEXT_PUBLIC_STRAPI_URL).
const remotePatterns: RemotePattern[] = [strapiPattern(new URL("http://localhost:1337"))];

if (process.env.NEXT_PUBLIC_STRAPI_URL) {
  remotePatterns.push(strapiPattern(new URL(process.env.NEXT_PUBLIC_STRAPI_URL)));
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
