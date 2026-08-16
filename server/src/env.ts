import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 chars (openssl rand -base64 32)"),
    BETTER_AUTH_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(4000),
    CLIENT_URL: z.string().url().default("http://localhost:3000"),
    // Comma-separated CIDR ranges / IPs of reverse proxies that may set
    // X-Forwarded-For. Empty in dev (no proxy). In prod, list your nginx /
    // Caddy / load balancer IP(s) — never a broad private range.
    TRUSTED_PROXIES: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
    CLOUDINARY_API_KEY: z.string().min(1).optional(),
    CLOUDINARY_API_SECRET: z.string().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
