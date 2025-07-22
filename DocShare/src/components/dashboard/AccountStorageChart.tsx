"use client";

import { useEffect, useState } from "react";
import { UserStats } from "@/types";
import { formatBytes } from "@/lib/utils";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountStorageChartProps {
  userStats: UserStats | null;
}

export default function AccountStorageChart({ userStats }: AccountStorageChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!userStats) return;

    // Tạo dữ liệu cho biểu đồ
    const documentsByType = userStats.documentsByType || {};
    const fileTypes = Object.keys(documentsByType);
    
    // Tạo màu ngẫu nhiên cho từng loại tài liệu
    const backgroundColors = [
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
    ];

    // Nếu có nhiều loại tài liệu hơn số màu có sẵn, tạo thêm màu ngẫu nhiên
    if (fileTypes.length > backgroundColors.length) {
      for (let i = backgroundColors.length; i < fileTypes.length; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
      }
    }

    setChartData({
      labels: fileTypes.map(type => type.split('/')[1] || type), // Hiển thị phần sau của MIME type
      datasets: [
        {
          label: 'Dung lượng (bytes)',
          data: fileTypes.map(type => documentsByType[type] * 1024), // Giả sử mỗi tài liệu có kích thước trung bình 1KB
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    });
  }, [userStats]);

  if (!chartData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-white/60">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: {
                  size: 12,
                },
                boxWidth: 15,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw as number;
                  return `${label}: ${formatBytes(value)}`;
                }
              }
            }
          },
        }}
      />
    </div>
  );
}
