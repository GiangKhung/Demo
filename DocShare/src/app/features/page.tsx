"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    RiFileUploadLine,
    RiSearchLine,
    RiUserSettingsLine,
    RiSecurePaymentLine,
    RiBookmarkLine,
    RiTimeLine,
    RiGlobalLine,
    RiShieldLine,
    RiDatabase2Line
} from "react-icons/ri";
import { BsLightningCharge, BsCloudUpload, BsShare } from "react-icons/bs";
import { Card, CardContent } from "@/components/ui/card";

// Component hiển thị một tính năng
interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, gradient }) => {
    return (
        <Card className="border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden group relative h-full">
            <CardContent className="p-6 sm:p-8">
                <div className={`mb-5 inline-flex rounded-full p-3 ${gradient}`}>
                    {icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-white/90 transition-colors">
                    {title}
                </h3>
                <p className="text-white/70 text-base leading-relaxed">
                    {description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </CardContent>
        </Card>
    );
};

// Thành phần hiển thị một nhóm tính năng
interface FeatureGroupProps {
    title: string;
    subtitle: string;
    features: FeatureProps[];
}

const FeatureGroup: React.FC<FeatureGroupProps> = ({ title, subtitle, features }) => {
    return (
        <section className="py-16 md:py-24 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80 mb-4">
                        {title}
                    </h2>
                    <p className="text-white/70 max-w-3xl mx-auto text-xl">
                        {subtitle}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Feature {...feature} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Trang Tính Năng chính
export default function FeaturesPage() {
    // Các tính năng cốt lõi
    const coreFeatures = [
        {
            icon: <RiFileUploadLine className="h-6 w-6 text-white" />,
            title: "Tải lên dễ dàng",
            description: "Tải lên tài liệu của bạn dễ dàng với giao diện kéo và thả trực quan. Hỗ trợ nhiều định dạng tệp khác nhau như PDF, DOCX, PPT và nhiều hơn nữa.",
            gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
        },
        {
            icon: <RiSearchLine className="h-6 w-6 text-white" />,
            title: "Tìm kiếm thông minh",
            description: "Công cụ tìm kiếm nâng cao giúp bạn nhanh chóng tìm thấy tài liệu cần thiết bằng cách tìm kiếm theo từ khóa, tác giả, chủ đề và thậm chí cả nội dung bên trong tài liệu.",
            gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
        },
        {
            icon: <BsShare className="h-6 w-6 text-white" />,
            title: "Chia sẻ linh hoạt",
            description: "Chia sẻ tài liệu với đồng nghiệp, bạn bè hoặc công khai cho cộng đồng. Thiết lập quyền truy cập và thời hạn chia sẻ theo nhu cầu của bạn.",
            gradient: "bg-gradient-to-br from-pink-500 to-pink-700",
        },
        {
            icon: <RiBookmarkLine className="h-6 w-6 text-white" />,
            title: "Đánh dấu thông minh",
            description: "Lưu trữ và sắp xếp tài liệu yêu thích của bạn với tính năng đánh dấu. Tạo và quản lý danh sách đọc cá nhân để dễ dàng truy cập sau này.",
            gradient: "bg-gradient-to-br from-orange-500 to-orange-700",
        },
        {
            icon: <RiUserSettingsLine className="h-6 w-6 text-white" />,
            title: "Giao diện thân thiện",
            description: "Giao diện người dùng trực quan và dễ sử dụng, được thiết kế tối ưu cho mọi thiết bị từ máy tính đến điện thoại di động.",
            gradient: "bg-gradient-to-br from-green-500 to-green-700",
        },
        {
            icon: <RiTimeLine className="h-6 w-6 text-white" />,
            title: "Lịch sử hoạt động",
            description: "Theo dõi lịch sử tải lên, xem và chia sẻ tài liệu của bạn. Dễ dàng quay lại với các tài liệu đã xem gần đây.",
            gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700",
        },
    ];

    // Các tính năng nâng cao
    const advancedFeatures = [
        {
            icon: <BsLightningCharge className="h-6 w-6 text-white" />,
            title: "Truy cập nhanh",
            description: "Tốc độ tải tài liệu siêu nhanh nhờ hệ thống phân phối nội dung toàn cầu và tối ưu hóa hiệu suất.",
            gradient: "bg-gradient-to-br from-amber-500 to-amber-700",
        },
        {
            icon: <RiSecurePaymentLine className="h-6 w-6 text-white" />,
            title: "Bán tài liệu",
            description: "Kiếm thu nhập từ tài liệu của bạn bằng cách thiết lập giá và bán chúng cho cộng đồng. Hệ thống thanh toán an toàn và bảo mật.",
            gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
        },
        {
            icon: <RiShieldLine className="h-6 w-6 text-white" />,
            title: "Bảo mật tối đa",
            description: "Bảo vệ tài liệu của bạn với mã hóa đầu cuối, xác thực hai yếu tố và kiểm soát quyền truy cập chi tiết.",
            gradient: "bg-gradient-to-br from-red-500 to-red-700",
        },
        {
            icon: <RiGlobalLine className="h-6 w-6 text-white" />,
            title: "Đa ngôn ngữ",
            description: "Hỗ trợ nhiều ngôn ngữ khác nhau, cho phép người dùng từ khắp nơi trên thế giới dễ dàng truy cập và sử dụng nền tảng.",
            gradient: "bg-gradient-to-br from-violet-500 to-violet-700",
        },
        {
            icon: <BsCloudUpload className="h-6 w-6 text-white" />,
            title: "Đồng bộ đám mây",
            description: "Kết nối với các dịch vụ lưu trữ đám mây phổ biến như Google Drive, Dropbox và OneDrive để truy cập tài liệu từ mọi nơi.",
            gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
        },
        {
            icon: <RiDatabase2Line className="h-6 w-6 text-white" />,
            title: "Lưu trữ không giới hạn",
            description: "Không lo về giới hạn lưu trữ với các gói dịch vụ linh hoạt. Lưu trữ và quản lý số lượng tài liệu lớn mà không giảm hiệu suất.",
            gradient: "bg-gradient-to-br from-teal-500 to-teal-700",
        },
    ];

    return (
        <div className="pt-24 min-h-screen bg-black relative overflow-hidden">
            {/* Gradient elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"></div>
                <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-pink-600/10 blur-3xl"></div>
            </div>

            {/* Hero Section */}
            <section className="py-16 md:py-24 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-6 md:mb-8">
                        Tính năng nổi bật
                    </h1>
                    <p className="text-white/70 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                        DocShare cung cấp các công cụ mạnh mẽ để quản lý, chia sẻ và khám phá tài liệu một cách dễ dàng, nhanh chóng và an toàn.
                    </p>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 mb-16 rounded-full"></div>
                </div>
            </section>

            {/* Các nhóm tính năng */}
            <FeatureGroup
                title="Tính năng cốt lõi"
                subtitle="Những công cụ cơ bản giúp bạn quản lý và chia sẻ tài liệu hiệu quả"
                features={coreFeatures}
            />

            <FeatureGroup
                title="Tính năng nâng cao"
                subtitle="Nâng tầm trải nghiệm với các công cụ chuyên nghiệp"
                features={advancedFeatures}
            />

            {/* CTA Section */}
            <section className="py-16 md:py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Sẵn sàng khám phá tất cả tính năng?
                    </h2>
                    <p className="text-white/70 text-xl max-w-2xl mx-auto mb-10">
                        Đăng ký ngay hôm nay và bắt đầu tận dụng các tính năng mạnh mẽ của DocShare
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                            Đăng ký miễn phí
                        </button>
                        <button className="bg-white/10 text-white hover:bg-white/20 py-3 px-8 rounded-full transition-all duration-300">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
} 