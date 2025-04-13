import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const SellerLogin = () => {
    const { seller, setSeller, navigate, axios } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            const { data } = await axios.post("/api/user/login", {
                email,
                password,
            });

            if (data.success) {
                if (data.user.role === "seller") {
                    setSeller(data.user);
                    navigate("/seller");
                } else {
                    toast.error("Access denied: Not a seller");
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (seller) {
            navigate("/seller");
        }
    }, [seller]);

    return (
        !seller && (
            <form
                onSubmit={onSubmitHandler}
                className="min-h-screen flex flex-col items-center justify-center text-sm text-gray-600"
            >
                <div className="flex flex-col gap-5 items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-primary">Seller</span> Login
                    </p>
                    <div className="w-full">
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Enter your email"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <p>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Enter your password"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-primary text-white w-full py-2 rounded-md cursor-pointer transition-all flex justify-center items-center ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-primary-dull"
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-4 text-primary underline text-sm hover:text-primary/80 cursor-pointer"
                >
                    Go to Home
                </button>
            </form>
        )
    );
};

export default SellerLogin;
