"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RiSendPlaneFill } from "react-icons/ri";

// Định nghĩa schema cho form
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Họ tên phải có ít nhất 2 ký tự.",
    }),
    email: z.string().email({
        message: "Vui lòng nhập một địa chỉ email hợp lệ.",
    }),
    subject: z.string().min(5, {
        message: "Tiêu đề phải có ít nhất 5 ký tự.",
    }),
    type: z.string({
        required_error: "Vui lòng chọn loại yêu cầu.",
    }),
    message: z.string().min(10, {
        message: "Tin nhắn phải có ít nhất 10 ký tự.",
    }),
});

export default function ContactForm() {
    // Khởi tạo form với React Hook Form và Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            type: "",
            message: "",
        },
    });

    // Xử lý khi submit form
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Trong thực tế, đây là nơi bạn sẽ gửi dữ liệu đến server
        console.log(values);
        // Hiển thị toast thông báo thành công (giả lập)
        alert("Cảm ơn! Chúng tôi đã nhận được tin nhắn của bạn.");
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Họ tên</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập họ tên của bạn"
                                        {...field}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="email@example.com"
                                        {...field}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Tiêu đề</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Tiêu đề liên hệ"
                                        {...field}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Loại yêu cầu</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500">
                                            <SelectValue placeholder="Chọn loại yêu cầu" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                        <SelectItem value="general">Thông tin chung</SelectItem>
                                        <SelectItem value="technical">Hỗ trợ kỹ thuật</SelectItem>
                                        <SelectItem value="billing">Vấn đề thanh toán</SelectItem>
                                        <SelectItem value="partnership">Hợp tác</SelectItem>
                                        <SelectItem value="feedback">Góp ý</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Tin nhắn</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Nhập tin nhắn của bạn tại đây..."
                                    className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                    <RiSendPlaneFill className="mr-2 h-5 w-5" />
                    Gửi tin nhắn
                </Button>
            </form>
        </Form>
    );
} 