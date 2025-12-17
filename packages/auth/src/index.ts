import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@my-better-t-app/db";
import * as schema from "@my-better-t-app/db/schema/auth";
import { createAuthMiddleware } from "better-auth/plugins";
import dotenv from 'dotenv';

dotenv.config({
	path: '../../../apps/server/.env'
});

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: ["mybettertapp://*", "my-better-t-app://*", "exp://*"],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
			prompt: "select_account",
			scope: ["openid", "profile", "email"],
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "lax",
			secure: false,
			httpOnly: true,
		},
		disableOriginCheck: true,
	},
	plugins: [expo()],
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			console.log("cookie", ctx.headers?.get("cookie"));
		}),
	},
});
