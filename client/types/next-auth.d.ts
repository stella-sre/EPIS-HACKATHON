import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    roles?:       string[]
    accessToken?: string
  }

  interface Session {
    accessToken?: string
    user: {
      id:     string
      email:  string
      name:   string
      roles:  string[]
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?:          string
    roles?:       string[]
    accessToken?: string
  }
}
