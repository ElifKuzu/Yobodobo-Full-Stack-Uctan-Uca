import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogEditPage from "./pages/BlogEditPage";

const App: React.FC = () => {
    return (
      <Routes>
        <Route path="/" element={<PrivateRoute><BlogListPage /></PrivateRoute>} />
        <Route path="/blog/:slug" element={<PrivateRoute><BlogDetailPage /></PrivateRoute>} />
        <Route path="/blog/new" element={<PrivateRoute><BlogEditPage /></PrivateRoute>} />
        <Route path="/blog/edit/:id" element={<PrivateRoute><BlogEditPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )};

    export default App;