import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

type AdminSession = {
  adminId: string;
  email: string;
  role: string;
};

async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(
      "frankyshots_admin_session"
    )?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.AUTH_SECRET;

    if (!secret) {
      throw new Error("AUTH_SECRET is not configured.");
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (!payload.adminId || !payload.email || !payload.role) {
      return null;
    }

    return {
      adminId: String(payload.adminId),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);

    return null;
  }
}

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Login nahi hai
  if (!session) {
    redirect("/admin/login");
  }

  // Sirf valid admin roles allowed hain
  if (
    session.role !== "SUPER_ADMIN" &&
    session.role !== "VICKVERSE_ADMIN"
  ) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}