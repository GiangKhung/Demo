"use client";

import { useEffect, useState } from "react";
import { UserStats } from "@/types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AccountDocumentTypeChartProps {
  userStats: UserStats | null;
}

export default function AccountDocumentTypeChart({ userStats }: AccountDocumentTypeChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!userStats) return;

    // Tạo dữ liệu cho biểu đồ
    const documentsByType = userStats.documentsByType || {};
    const fileTypes = Object.keys(documentsByType);
    
    // Tạo màu cho từng loại tài liệu
    const backgroundColor = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
    ];

    // Nếu có nhiều loại tài liệu hơn số màu có sẵn, tạo thêm màu ngẫu nhiên
    if (fileTypes.length > backgroundColor.length) {
      for (let i = backgroundColor.length; i < fileTypes.length; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        backgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
      }
    }

    setChartData({
      labels: fileTypes.map(type => {
        // Hiển thị phần sau của MIME type hoặc phần mở rộng
        const parts = type.split('/');
        return parts.length > 1 ? parts[1].toUpperCase() : type.toUpperCase();
      }),
      datasets: [
        {
          label: 'Số lượng tài liệu',
          data: fileTypes.map(type => documentsByType[type]),
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
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
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw as number;
                  return `Số lượng: ${value} tài liệu`;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: 'rgba(255, 255, 255, 0.7)',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
        }}
      />
    </div>
  );
}
