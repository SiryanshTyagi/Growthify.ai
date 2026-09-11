import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";

const apiUrl = import.meta.env.VITE_API_URL;
const routerBasename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL;

if (apiUrl) {
  axios.defaults.baseURL = apiUrl.replace(/\/$/, "");
}

const savedTheme = localStorage.getItem("theme");
document.documentElement.setAttribute("data-theme", savedTheme === "light" ? "light" : "dark");

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthProvider>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </AuthProvider>
  // </StrictMode>,
);
