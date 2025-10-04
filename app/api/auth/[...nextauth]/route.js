import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/connectDb";
import User from "@/models/User";
import { compare } from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        let isPasswordValid = false;
        if (user) {
          isPasswordValid = await compare(credentials.password, user.password);
        }
        if (isPasswordValid) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default authOptions
