import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/v1/auth/signin`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              email:    credentials.email,
              password: credentials.password,
            }),
          },
        )

        if (!res.ok) return null

        const data = await res.json()
        return {
          id:          data.user.id,
          email:       data.user.email,
          name:        data.user.name,
          roles:       data.user.roles  as string[],
          accessToken: data.token       as string,
        }
      },
    }),
  ],

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn   = !!auth?.user
      const isDashboard  = request.nextUrl.pathname.startsWith("/dashboard")
      if (isDashboard) return isLoggedIn
      return true
    },

    jwt({ token, user }) {
      if (user) {
        token.id          = user.id
        token.roles       = (user as any).roles       as string[]
        token.accessToken = (user as any).accessToken as string
      }
      return token
    },

    session({ session, token }) {
      session.user.id   = token.id          as string
      session.user.roles       = token.roles       as string[]
      session.accessToken      = token.accessToken as string
      return session
    },
  },

  pages:   { signIn: "/login" },
  session: { strategy: "jwt" },
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
