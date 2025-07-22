"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function ConnectionTest() {
  const [status, setStatus] = useState<string>("Chưa test");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get("/health");
      setStatus(`✅ Kết nối thành công: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setStatus(`❌ Lỗi kết nối: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg text-white text-sm max-w-md">
      <div className="mb-2">
        <strong>Backend Connection Test</strong>
      </div>
      <div className="mb-2 text-xs">
        API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}
      </div>
      <div className="mb-2">{status}</div>
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 px-3 py-1 rounded text-xs"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>
    </div>
  );
}
