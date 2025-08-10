// Entry point for the React application
// This file is responsible for bootstrapping the React app into the DOM

import { createRoot } from 'react-dom/client' // React 18's concurrent rendering API
import App from './App.tsx' // Main application component
import './index.css' // Global styles and Tailwind CSS imports

// Create a root element for React 18's concurrent features
// The non-null assertion (!) ensures TypeScript knows the element exists
createRoot(document.getElementById("root")!).render(<App />);
