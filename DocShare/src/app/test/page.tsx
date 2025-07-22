"use client";

import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test với document ID có sẵn
      const documentId = "68789765f3daacaa99445025";
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setResult(data);
    } catch (err: any) {
      console.error("API test error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testWithAuth = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      const documentId = "68789765f3daacaa99445025";
      const headers: any = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: "GET",
        headers,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setResult(data);
    } catch (err: any) {
      console.error("API test error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testAPI}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
          >
            {loading ? "Testing..." : "Test API (No Auth)"}
          </button>

          <button
            onClick={testWithAuth}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg ml-4"
          >
            {loading ? "Testing..." : "Test API (With Auth)"}
          </button>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-red-400">Error:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-600/20 border border-green-600 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-2">Success:</h3>
            <pre className="text-green-300 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-300">
            <li>Open Developer Tools (F12)</li>
            <li>Go to Console tab</li>
            <li>Click "Test API" buttons</li>
            <li>Check console logs for detailed information</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
