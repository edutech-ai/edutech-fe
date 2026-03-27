"use client";

import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Upload, User as UserIcon, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import {
  getProfile,
  updateProfile,
  createProfile,
} from "@/services/profileService";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { isCloudinaryConfigured } from "@/config/cloudinary";
import type { Profile, UpdateProfileRequest } from "@/types/profile";
import provincesData from "@/constants/countries.json";
import { useUserStore } from "@/store/useUserStore";
import { profileSchema, type ProfileFormData } from "@/schemas";

const provinces = Object.values(provincesData).map((province) => ({
  code: province.code,
  name: province.name_with_type,
}));

export function ProfileInfoForm() {
  const updateUser = useUserStore((state) => state.updateUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [hasProfile, setHasProfile] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      date_of_birth: "",
      gender: "",
      address: "",
      email_notification: false,
      push_notification: false,
    },
  });

  const avatarUrl = watch("avatar_url");

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setHasProfile(true);

        // Format date_of_birth
        let formattedDate = "";
        if (data.date_of_birth) {
          const date = new Date(data.date_of_birth);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split("T")[0];
          }
        }

        // Populate form
        setValue("name", data.name || "");
        setValue("date_of_birth", formattedDate);
        setValue("gender", data.gender || "");
        setValue("avatar_url", data.avatar_url || "");
        setValue("address", data.address || "");
        setValue("email_notification", !!data.email_notification);
        setValue("push_notification", !!data.push_notification);

        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url);
        }
      } catch (error: unknown) {
        // Profile doesn't exist yet (404)
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status: number } };
          if (axiosError.response?.status === 404) {
            setHasProfile(false);
            toast.info("Vui lòng hoàn thiện thông tin cá nhân");
          } else {
            toast.error("Không thể tải thông tin cá nhân");
          }
        } else {
          toast.error("Không thể tải thông tin cá nhân");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [setValue]);

  // Handle avatar upload
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check Cloudinary configuration
    if (!isCloudinaryConfigured()) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadToCloudinary(file);
      setValue("avatar_url", result.secure_url);
      setAvatarPreview(result.secure_url);
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tải ảnh lên";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: Record<string, any>) => {
    const firstKey = Object.keys(errors)[0];
    const fieldLabels: Record<string, string> = {
      name: "Họ và tên",
      date_of_birth: "Ngày sinh",
      gender: "Giới tính",
      avatar_url: "Ảnh đại diện",
      address: "Tỉnh/Thành phố",
      email_notification: "Thông báo email",
      push_notification: "Thông báo",
    };
    const label = fieldLabels[firstKey] ?? firstKey;
    toast.error(`Vui lòng kiểm tra lại: ${label}`);
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);

    try {
      const updateData: UpdateProfileRequest = {
        name: data.name,
        date_of_birth: data.date_of_birth || undefined,
        gender: data.gender || undefined,
        avatar_url: data.avatar_url || undefined,
        address: data.address || undefined,
        email_notification: data.email_notification,
        push_notification: data.push_notification,
      };

      let updatedProfile: Profile;
      if (hasProfile) {
        updatedProfile = await updateProfile(updateData);
        toast.success("Cập nhật thông tin thành công");
      } else {
        updatedProfile = await createProfile(updateData);
        setHasProfile(true);
        toast.success("Tạo hồ sơ thành công");
      }

      // Merge with existing profile to keep email, role, subject
      const mergedProfile = {
        ...profile,
        ...updatedProfile,
        email: profile?.email || updatedProfile.email,
        role: profile?.role || updatedProfile.role,
        subject: profile?.subject || updatedProfile.subject,
      };

      setProfile(mergedProfile);

      // Re-populate form with updated values
      let formattedDate = "";
      if (mergedProfile.date_of_birth) {
        const date = new Date(mergedProfile.date_of_birth);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }
      setValue("date_of_birth", formattedDate);

      if (updatedProfile.name) {
        updateUser({ name: updatedProfile.name });
      }
    } catch {
      toast.error("Không thể lưu thông tin. Vui lòng thử lại");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-6 max-w-4xl"
    >
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Ảnh đại diện</CardTitle>
          <CardDescription>
            Thay đổi ảnh đại diện của bạn (tối đa 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarPreview || avatarUrl ? (
                <Image
                  src={avatarPreview || avatarUrl || ""}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
          <div className="flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG hoặc GIF. Kích thước tối đa 5MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email and Name - Same row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nhập họ và tên"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Date of Birth and Gender - Same row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Ngày sinh</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register("date_of_birth")}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-red-500">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={watch("gender") || ""}
                onValueChange={(value) => setValue("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tỉnh thành */}
          <div className="space-y-2">
            <Label htmlFor="address">Tỉnh/Thành phố</Label>
            <Select
              value={watch("address") || ""}
              onValueChange={(value) => setValue("address", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent className="max-h-75">
                {provinces.map((province) => (
                  <SelectItem key={province.code} value={province.name}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role and Subject (readonly) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Input
                value={profile?.role || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Môn học</Label>
              <Input
                value={profile?.subject || "Chưa cập nhật"}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Cài đặt thông báo
          </CardTitle>
          <CardDescription>Quản lý nhận thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email_notification"
              checked={watch("email_notification") || false}
              onCheckedChange={(checked) => {
                setValue("email_notification", checked as boolean);
                if (checked) {
                  toast.success("Đã bật thông báo qua email");
                } else {
                  toast.info("Đã tắt thông báo qua email");
                }
              }}
            />
            <Label
              htmlFor="email_notification"
              className="text-sm font-normal cursor-pointer"
            >
              Nhận thông báo qua email
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="push_notification"
              checked={watch("push_notification") || false}
              onCheckedChange={(checked) => {
                setValue("push_notification", checked as boolean);
                if (checked) {
                  toast.success("Đã bật thông báo");
                } else {
                  toast.info("Đã tắt thông báo");
                }
              }}
            />
            <Label
              htmlFor="push_notification"
              className="text-sm font-normal cursor-pointer"
            >
              Nhận thông báo
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>
    </form>
  );
}
