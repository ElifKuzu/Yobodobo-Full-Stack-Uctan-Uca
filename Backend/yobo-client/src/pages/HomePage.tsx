import { useAuth } from "../auth/AuthContext";

const HomePage: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Welcome, {user?.fullName || user?.email}!</h2>
                <p className="text-center text-gray-600">You are logged in.</p>
                <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;