import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen px-4">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
                <p className="text-2xl md:text-3xl text-gray-700 mt-4 font-semibold">
                    Oops! Page not found
                </p>
                <p className="text-gray-500 mt-2 mb-6">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
