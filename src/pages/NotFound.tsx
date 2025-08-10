import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * NotFound Component
 * 
 * This component serves as a 404 error page that displays when users attempt to access
 * a route that doesn't exist in the application. It provides a user-friendly error message
 * and a way to navigate back to the home page.
 * 
 * Key Features:
 * - Displays a 404 error message with visual styling
 * - Logs 404 errors to the console for debugging purposes
 * - Provides a link to return to the home page
 * - Uses responsive design with Tailwind CSS classes
 * 
 * @returns {JSX.Element} The 404 error page component
 */
const NotFound = () => {
  // useLocation hook from react-router-dom provides access to the current location object
  // This allows us to access the pathname that the user attempted to visit
  const location = useLocation();

  /**
   * useEffect hook runs when the component mounts or when location.pathname changes
   * This is used for logging purposes to track 404 errors in development/production
   * 
   * The dependency array [location.pathname] ensures this effect runs whenever
   * the pathname changes, which is useful if users navigate to multiple non-existent routes
   */
  useEffect(() => {
    // Log 404 errors to the console for debugging and monitoring purposes
    // This helps developers identify broken links or missing routes
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    // Main container with full viewport height and centered content
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Content container with centered text */}
      <div className="text-center">
        {/* Large 404 error code display */}
        <h1 className="text-4xl font-bold mb-4">404</h1>
        
        {/* User-friendly error message */}
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        
        {/* Navigation link back to home page */}
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

// Export the component for use in React Router configuration
export default NotFound;
