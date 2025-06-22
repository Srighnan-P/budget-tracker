import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from "@/utils/supabase";
 
export const { handlers, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({user }) {
      const email = user.email?.toLowerCase();


      if (!email) return false;

      const { data: existingUser, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows found; any other error = fail sign-in
        console.error('Error checking Supabase:', fetchError.message);
        return false;
      }

      if (!existingUser) {
        // User not in DB, insert them
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({ email });

        if (insertError) {
          // If error is duplicate key, treat as success
          if (
            insertError.message.includes('duplicate key value') ||
            insertError.message.includes('already exists')
          ) {
            // User already exists, treat as success
            return true;
          }
          console.error('Failed to insert user:', insertError.message);
          return false;
        }
      }

      return true;

    },
  },
  secret: process.env.NEXTAUTH_SECRET
})