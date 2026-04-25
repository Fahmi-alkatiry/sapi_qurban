import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Protect all /admin routes EXCEPT the login page itself
  matcher: ["/admin/dashboard/:path*"],
};
