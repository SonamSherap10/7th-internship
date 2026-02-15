import { api } from "./apiClient";
import type { User } from "../state/auth/types";

export async function loginApi(email: string, password: string) {
  const res = await api.post("/api/login", { email, password });
  const data = res.data as { token: string; user: any; message: string };
  const u = data.user;
  return {
    ...data,
    user: {
      id: u?.id ?? u?._id?.toString?.(),
      name: u?.name,
      email: u?.email,
      phone: u?.phone ?? "",
      role: u?.role ?? "user",
      image: u?.image,
    } as User,
  };
}

export async function registerApi(form: FormData) {
  const res = await api.post("/api/register", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as { message: string };
}

export async function forgotPasswordApi(email: string) {
  const res = await api.post("/api/forgotPassword", { email });
  return res.data as { message: string };
}

export async function otpApi(email: string, otp: string) {
  const res = await api.post("/api/otp", { email, otp });
  return res.data as { message: string };
}

export async function resetPasswordApi(email: string, newpassword: string, confirmpassword: string) {
  const res = await api.post("/api/resetPassword", { email, newpassword, confirmpassword });
  return res.data as { message: string };
}

export async function updateProfilePhotoApi(form: FormData) {
  const res = await api.put("/api/profile-photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = res.data as { message: string; user: User };
  return data;
}


