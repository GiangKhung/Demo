"use client";

import { useState } from "react";

export default function ConnectionTest() {
  const [status, setStatus] = useState<string>("Chưa test");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test backend health
      const backendUrl = "https://endearing-optimism-production.up.railway.app";
      const response = await fetch(`${backendUrl}/health`);
      const data = await response.json();

      setStatus(`✅ Backend OK: ${JSON.stringify(data)}`);

      // Test API
      const apiResponse = await fetch(`${backendUrl}/api/health`);
      const apiData = await apiResponse.json();

      setStatus((prev) => prev + `\n✅ API OK: ${JSON.stringify(apiData)}`);
    } catch (error: any) {
      setStatus(`❌ Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white mb-4">Test Backend Connection</h3>
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>
      <pre className="text-green-400 text-sm whitespace-pre-wrap">{status}</pre>
    </div>
  );
}
