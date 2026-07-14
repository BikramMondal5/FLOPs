import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import clientPromise, { connectDB } from "@/lib/mongodb";
import { loginSchema } from "@/lib/schemas/auth";

export const { auth, signIn, signOut, handlers } = NextAuth({
  // Spread the shared edge-compatible base config
  ...authConfig,

  // ─────────────────────────────────────────────
  // MongoDB Adapter — persists accounts, sessions, verification_tokens
  // Only runs in Node.js runtime (API routes, server components)
  // ─────────────────────────────────────────────
  adapter: MongoDBAdapter(clientPromise!, {
    databaseName: "flops",
    collections: {
      Users: "users",
      Accounts: "accounts",
      Sessions: "sessions",
      VerificationTokens: "verification_tokens",
    },
  }),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ─────────────────────────────────────────────
  // Providers
  // ─────────────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid email or password format");
        }

        const { email, password } = parsed.data;

        const db = await connectDB();
        const user = await db.collection("users").findOne({ email });

        if (!user) {
          throw new Error("No account found with this email address");
        }

        if (!user.password) {
          throw new Error(
            "Please sign in with the method you used to create this account"
          );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password. Please try again");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role,
          currency: user.currency,
          country: user.country,
          language: user.language,
          timezone: user.timezone,
        };
      },
    }),

    // ─────────────────────────────────────────────
    // Google OAuth
    // ─────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Populate default profile fields for new Google sign-ups
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
          currency: "INR",
          country: "India",
          language: "English",
          timezone: "Asia/Kolkata",
        };
      },
      // Allow linking Google to an existing email/password account
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  // ─────────────────────────────────────────────
  // Callbacks — inject custom fields into JWT & session
  // ─────────────────────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.currency = (user as any).currency;
        token.country = (user as any).country;
        token.language = (user as any).language;
        token.timezone = (user as any).timezone;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.currency = token.currency as string;
        session.user.country = token.country as string;
        session.user.language = token.language as string;
        session.user.timezone = token.timezone as string;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
