"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthFooter } from "@/components/auth/auth-footer";

import { useToast } from "@/components/ui/use-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return false;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      toast({
        title: "Lỗi",
        description:
          "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(formData.name, formData.email, formData.password);
      toast({
        title: "Thành công",
        description: "Đăng ký thành công!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Register error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Đăng ký thất bại",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Tham gia DocShare để chia sẻ và quản lý tài liệu"
      variant="register"
    >
      <div className="w-full max-w-md mx-auto">
        <AuthForm onSubmit={handleSubmit}>
          <AuthInput
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            label="Họ và tên"
            required
          />

          <AuthInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            label="Email"
            required
          />

          <AuthInput
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            label="Mật khẩu"
            required
          />

          <AuthInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            label="Xác nhận mật khẩu"
            required
          />

          <AuthButton
            type="submit"
            isLoading={isLoading}
            loadingText="Đang đăng ký..."
          >
            Đăng ký
          </AuthButton>
        </AuthForm>

        <div className="mt-8">
          <AuthFooter
            question="Đã có tài khoản?"
            linkText="Đăng nhập ngay"
            linkHref="/auth/login"
          />
        </div>
      </div>
    </AuthLayout>
  );
}
