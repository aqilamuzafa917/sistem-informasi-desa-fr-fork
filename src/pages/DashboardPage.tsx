// import { Button } from 'flowbite-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token (e.g., from localStorage)
    localStorage.removeItem("authToken");
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to the Dashboard!
        </h1>
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
          This is a protected area. Only logged-in users can see this.
        </p>
        <Button onClick={handleLogout} color="failure">
          Logout
        </Button>
      </div>
    </div>
  );
}
