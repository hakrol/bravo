"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAvailable,
  isAdminAuthConfigured,
  validateAdminLogin,
} from "@/lib/admin/auth";

export async function loginAdmin(formData: FormData) {
  if (!isAdminAvailable()) {
    redirect("/");
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isAdminAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const isValid = await validateAdminLogin(username, password);

  if (!isValid) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession(username);
  redirect("/admin");
}

export async function logoutAdmin() {
  if (!isAdminAvailable()) {
    redirect("/");
  }

  await clearAdminSession();
  redirect("/admin/login");
}
