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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast({
        title: "Thành công",
        description: "Đăng nhập thành công!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Đăng nhập thất bại",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục sử dụng DocShare"
      variant="login"
    >
      <div className="w-full max-w-md mx-auto">
        <AuthForm onSubmit={handleSubmit}>
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

          <AuthButton
            type="submit"
            isLoading={isLoading}
            loadingText="Đang đăng nhập..."
          >
            Đăng nhập
          </AuthButton>
        </AuthForm>

        <div className="mt-8">
          <AuthFooter
            question="Chưa có tài khoản?"
            linkText="Đăng ký ngay"
            linkHref="/auth/register"
          />
        </div>
      </div>
    </AuthLayout>
  );
}
