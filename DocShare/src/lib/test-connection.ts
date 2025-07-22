import { wakeUpBackend } from "./api";

export const testBackendConnection = async () => {
  console.log("🔄 Testing backend connection...");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log("📍 Backend URL:", backendUrl);
  console.log("📍 API URL:", apiUrl);

  if (!backendUrl || !apiUrl) {
    console.error("❌ Environment variables not set!");
    return false;
  }

  try {
    // Test health endpoint
    const response = await fetch(`${backendUrl}/health`);
    const data = await response.json();

    console.log("✅ Backend health check:", data);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
    return false;
  }
};
