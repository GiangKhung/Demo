"use client";

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "DocShare là gì?",
        answer: "DocShare là nền tảng chia sẻ tài liệu trực tuyến cho phép người dùng tải lên, lưu trữ, quản lý và chia sẻ tài liệu với bạn bè, đồng nghiệp hoặc công khai với cộng đồng. Chúng tôi hỗ trợ nhiều định dạng tệp khác nhau như PDF, Word, Excel, PowerPoint và nhiều loại khác."
    },
    {
        question: "Làm thế nào để tôi tạo tài khoản?",
        answer: "Để tạo tài khoản, bạn chỉ cần nhấp vào nút 'Đăng ký' ở góc phải trên cùng của trang web. Sau đó, bạn sẽ được yêu cầu cung cấp thông tin cơ bản như tên, email và mật khẩu. Bạn cũng có thể đăng ký bằng tài khoản Google, Facebook hoặc Github của mình để tiết kiệm thời gian."
    },
    {
        question: "Các định dạng tệp nào được hỗ trợ?",
        answer: "DocShare hỗ trợ hầu hết các định dạng tệp phổ biến bao gồm PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, TXT, CSV, JPG, PNG, GIF và nhiều hơn nữa. Hệ thống của chúng tôi sẽ tự động tạo bản xem trước cho nhiều loại tệp, giúp người dùng xem tài liệu mà không cần tải xuống."
    },
    {
        question: "Tôi có thể chia sẻ tài liệu như thế nào?",
        answer: "Sau khi tải tài liệu lên, bạn có thể chia sẻ bằng cách nhấp vào nút 'Chia sẻ' bên dưới tài liệu đó. Bạn có thể chọn chia sẻ qua email, tạo liên kết công khai hoặc riêng tư, hoặc đặt mật khẩu cho liên kết. Bạn cũng có thể thiết lập thời hạn cho liên kết và quyền truy cập (chỉ xem hoặc cho phép tải xuống)."
    },
    {
        question: "DocShare có miễn phí không?",
        answer: "DocShare cung cấp cả phiên bản miễn phí và trả phí. Với tài khoản miễn phí, bạn có thể tải lên và chia sẻ số lượng tài liệu giới hạn với giới hạn dung lượng. Các gói trả phí của chúng tôi cung cấp thêm dung lượng lưu trữ, tính năng bảo mật nâng cao, phân tích chi tiết và nhiều lựa chọn tùy chỉnh hơn."
    },
    {
        question: "Làm thế nào để xóa tài liệu đã tải lên?",
        answer: "Bạn có thể dễ dàng xóa tài liệu bằng cách đăng nhập vào tài khoản của mình, điều hướng đến trang 'Tài liệu của tôi', tìm tài liệu bạn muốn xóa, nhấp vào biểu tượng 'Tùy chọn' (ba chấm) và chọn 'Xóa'. Hệ thống sẽ yêu cầu xác nhận trước khi xóa vĩnh viễn tài liệu."
    },
    {
        question: "DocShare có an toàn không?",
        answer: "Có, bảo mật là ưu tiên hàng đầu của chúng tôi. Chúng tôi sử dụng mã hóa SSL để bảo vệ dữ liệu trong quá trình truyền tải, lưu trữ tài liệu trên máy chủ bảo mật, và cung cấp các tùy chọn như xác thực hai yếu tố, kiểm soát quyền truy cập và đăng nhập an toàn. Chúng tôi tuân thủ các quy định bảo vệ dữ liệu và không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba."
    },
];

export default function FAQSection() {
    return (
        <div className="py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80 mb-4">
                        Câu hỏi thường gặp
                    </h2>
                    <p className="text-white/70 max-w-3xl mx-auto text-lg">
                        Tìm câu trả lời nhanh cho những câu hỏi phổ biến về DocShare
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm overflow-hidden"
                            >
                                <AccordionTrigger className="px-6 py-4 text-white hover:text-white/90 hover:no-underline text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 text-white/70 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="text-center mt-8 pt-8 border-t border-white/10">
                        <p className="text-white/70 mb-4">
                            Không tìm thấy câu trả lời bạn đang tìm kiếm?
                        </p>
                        <button className="bg-white/10 text-white hover:bg-white/20 py-2 px-6 rounded-full transition-all duration-300">
                            Liên hệ với chúng tôi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 