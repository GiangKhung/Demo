"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export default function ContactMap() {
    return (
        <Card className="border-white/10 overflow-hidden h-full">
            <div className="w-full h-full min-h-[400px] relative group">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/30 transition-all duration-500 z-10"></div>

                {/* Map embed frame */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177540681075!2d106.69892001078715!3d10.771100359237603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1675469790468!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.8)" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="DocShare Office Location"
                    className="absolute inset-0 w-full h-full group-hover:opacity-100 transition-all duration-500"
                ></iframe>

                {/* Location label */}
                <div className="absolute bottom-0 left-0 right-0 text-center p-4 bg-gradient-to-t from-black to-transparent z-20">
                    <div className="inline-block px-4 py-2 bg-blue-500/90 rounded-full text-white text-sm font-medium mb-1">
                        Văn phòng DocShare
                    </div>
                    <p className="text-white/80 text-sm">
                        Tòa nhà Innovation, 123 Đường Công Nghệ, Quận 1, TP. HCM
                    </p>
                </div>
            </div>
        </Card>
    );
} 