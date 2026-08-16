import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "@/env";
import * as schema from "@/db/schema";

const googleConfigured = !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET;
const trustedProxies =
  env.TRUSTED_PROXIES?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  ...(googleConfigured && {
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      },
    },
  }),
  user: {
    additionalFields: {
      phone: { type: "string", required: false },
      role: { type: "string", defaultValue: "customer", input: false },
    },
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  advanced: {
    database: { generateId: "uuid" },
    useSecureCookies: env.NODE_ENV === "production",
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
      trustedProxies,
    },
  },
  trustedOrigins: [env.CLIENT_URL],
  rateLimit: { enabled: true },
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
