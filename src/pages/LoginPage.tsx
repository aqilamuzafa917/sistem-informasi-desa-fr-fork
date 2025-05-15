import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Label, TextInput, Alert } from 'flowbite-react'; // Assuming you use these components

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://thankful-urgently-silkworm.ngrok-free.app/api';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Assuming the API returns a message like { message: "error message", ... }
        // Or if it's just a string: data.error
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Assuming the API returns a token or user data upon successful login
      console.log('Login successful:', data);
      // Store token (e.g., in localStorage)
      // Make sure your API returns a token, e.g., data.token or data.access_token
      if (data.token) { // Adjust 'data.token' based on your API response
        localStorage.setItem('authToken', data.token);
         navigate('/dashboard'); // Redirect to dashboard
      } else {
        // If the API response for success doesn't include a token as expected
        throw new Error('Login successful, but no token received.');
      }

      // Redirect to a protected route (e.g., dashboard)
      // For now, let's redirect to the home page
      // navigate('/'); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login
        </h1>
        {error && (
          <Alert color="failure" onDismiss={() => setError(null)} className="mb-4">
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
         <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            Don't have an account? <a href="/signup" className="text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            Or go <a href="/" className="text-primary-600 hover:underline dark:text-primary-500">Back to Home</a>
        </p>
      </Card>
    </div>
  );
}