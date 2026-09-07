import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export const dynamic = "force-dynamic";

type AdminSession = {
  adminId: string;
  email: string;
  role: string;
};

async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "frankyshots_admin_session"
  )?.value;

  if (!token) {
    return null;
  }

  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.error("AUTH_SECRET is not configured.");
    return null;
  }

  try {
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
    console.error("ADMIN SESSION ERROR:", error);
    return null;
  }
}

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (
    session.role !== "SUPER_ADMIN" &&
    session.role !== "VICKVERSE_ADMIN"
  ) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}