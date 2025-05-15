import { DarkThemeToggle } from "flowbite-react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Import the HomePage
import LoginPage from "./pages/LoginPage"; // Import the LoginPage
import DashboardPage from "./pages/DashboardPage"; // Import the DashboardPage
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

// You might want to create a DashboardPage for after login
// import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <>
      
      {/* <div className="absolute top-4 right-4 z-50"> 
        <DarkThemeToggle />
      </div> */}
      
      
      {/* <nav className="bg-gray-100 dark:bg-gray-800 p-4 absolute top-16 right-4 z-50 rounded shadow">
        <ul className="flex flex-col space-y-2">
          <li>
            <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">Home</Link>
          </li>
          <li>
            <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">Login</Link>
          </li>
          
          <li>
            <Link to="/dashboard" className="text-blue-600 hover:underline dark:text-blue-400">Dashboard</Link>
          </li>
        </ul>
      </nav> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </>
  );
}
