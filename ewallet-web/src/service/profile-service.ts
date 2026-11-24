// src/services/profileService.ts
import { apiFetch } from "@/lib/api"
import type { UserProfileDto } from "./dashboard-service"

export interface UpdateProfilePayload {
  fullName: string
  phoneNumber: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export const profileService = {
  getProfile: () => apiFetch<UserProfileDto>("/profile"),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiFetch<UserProfileDto>("/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  changePassword: (payload: ChangePasswordPayload) =>
    apiFetch<{ message: string }>("/profile/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
}
