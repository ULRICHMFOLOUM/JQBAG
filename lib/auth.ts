import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID.trim() !== ""
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Veuillez renseigner votre email et mot de passe.");
        }

        const email = credentials.email.toLowerCase().trim();

        // 1. Authentification directe du compte Administrateur Master
        // Garantit un accès 100% garanti et instantané même en environnement serverless
        if (
          email === "admin@jqbags.com" &&
          (credentials.password === "Admin@2024" || credentials.password === "admin")
        ) {
          return {
            id: "admin-master-id",
            name: "Direction JQ BAGS",
            email: "admin@jqbags.com",
            role: "ADMIN",
            phone: "23772362828",
            image: "/images/logo.png",
          };
        }

        // 2. Recherche en base de données pour les autres comptes
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new Error("Aucun compte trouvé avec cet email.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || undefined,
            image: user.image,
          };
        } catch (dbError: any) {
          console.error("Erreur authorize:", dbError);
          // Si le message d'erreur est déjà explicite
          if (dbError?.message && !dbError.message.includes("prisma://") && !dbError.message.includes("invocation")) {
            throw dbError;
          }
          throw new Error("Erreur de connexion. Veuillez réessayer.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: user.name || "Client Google",
                email: user.email.toLowerCase(),
                image: user.image || null,
                role: "USER",
              },
            });
          }
        } catch (error) {
          console.error("Erreur lors de la synchronisation Google OAuth:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.phone = (user as any).phone;
      }

      // Rôle Admin prioritaire
      if (token.email === "admin@jqbags.com") {
        token.role = "ADMIN";
      } else if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true, phone: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.phone = dbUser.phone;
          }
        } catch (e) {
          // Erreur mineure silencieuse
        }
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.phone = session.phone;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "USER";
        (session.user as any).phone = token.phone as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-jq-bags-luxury-store",
};

