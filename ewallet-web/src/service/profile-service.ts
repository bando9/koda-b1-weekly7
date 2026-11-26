import type { UserProfileDto } from "./dashboard-service"
import { apiRequest } from "./auth-api"

export interface UpdateProfilePayload {
  fullName: string
  phoneNumber: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export const profileService = {
  getProfile: (accessToken: string | null) =>
    apiRequest<UserProfileDto>("/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  updateProfile: (payload: UpdateProfilePayload, accessToken: string | null) =>
    apiRequest<UserProfileDto>("/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  changePassword: (
    payload: ChangePasswordPayload,
    accessToken: string | null
  ) =>
    apiRequest<{ message: string }>("/profile/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
}
