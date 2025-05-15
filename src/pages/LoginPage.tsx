import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import axios from "axios"; // ⬅️ Tambahkan ini

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "https://thankful-urgently-silkworm.ngrok-free.app/api";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      const data = response.data;

      if (!data.token) {
        throw new Error("Login successful, but no token received.");
      }

      // Simpan token & redirect
      localStorage.setItem("authToken", data.token);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message,
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Login
        </h1>
        {error && (
          <Alert
            color="failure"
            onDismiss={() => setError(null)}
            className="mb-4"
          >
            <span>
              <span className="font-medium">Login Error!</span> {error}
            </span>
          </Alert>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="admin1@desa.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="password123"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" isProcessing={loading} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-primary-600 dark:text-primary-500 hover:underline"
          >
            Sign up
          </a>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or go{" "}
          <a
            href="/"
            className="text-primary-600 dark:text-primary-500 hover:underline"
          >
            Back to Home
          </a>
        </p>
      </Card>
    </div>
  );
}
