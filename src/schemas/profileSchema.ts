import * as z from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .max(500, "Tên không được vượt quá 500 ký tự")
    .optional(),
  date_of_birth: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      },
      { message: "Ngày sinh không được trong tương lai" }
    ),
  gender: z.string().optional(),
  avatar_url: z.string().optional(),
  address: z.string().optional(),
  email_notification: z.boolean().optional(),
  push_notification: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
