import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "./../assets/assets";
import { useAppContext } from "./../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
    const location = useLocation();

    const [logoutLoading, setLogoutLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const {
        user,
        setUser,
        setShowUserLogin,
        setRedirectPath,
        navigate,
        searchQuery,
        setSearchQuery,
        getCartCount,
        axios,
    } = useAppContext();

    const logout = async () => {
        if (logoutLoading) return;
        setLogoutLoading(true);

        try {
            const { data } = await axios.delete("/api/user/logout");

            if (data.success) {
                toast.success(data.message);
                setUser(null);
                navigate("/");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLogoutLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery]);

    return (
        <nav className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
            <NavLink to="/" onClick={() => setOpen(false)}>
                <img
                    className="h-7 sm:h-8 md:h-8"
                    src={assets.logo}
                    alt="Logo"
                />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex flex-wrap xl:flex-nowrap items-center gap-3 md:gap-4 xl:gap-8 max-w-full ">
                <NavLink to="/" className="hover:text-primary">
                    Home
                </NavLink>
                <NavLink to="/products" className="hover:text-primary">
                    All Product
                </NavLink>
                <NavLink to="/contact" className="hover:text-primary">
                    Contact
                </NavLink>
                <NavLink to="/seller" className="hover:text-primary">
                    Seller
                </NavLink>

                <div className="hidden lg:flex flex-1 items-center text-sm gap-2 border border-gray-300 px-3 rounded-full min-w-[180px] max-w-[300px]">
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                    />
                    <img
                        src={assets.search_icon}
                        alt="search"
                        className="w-4 h-4"
                    />
                </div>

                <div
                    onClick={() => navigate("/cart")}
                    className="relative cursor-pointer"
                >
                    <img
                        src={assets.nav_cart_icon}
                        alt="cart"
                        className="w-6 opacity-80"
                    />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </button>
                </div>

                {!user ? (
                    <button
                        onClick={() => {
                            setRedirectPath(location.pathname);
                            setShowUserLogin(true);
                        }}
                        className="cursor-pointer text-sm md:text-base px-5 md:px-8 py-1.5 md:py-2 lg:px-7 lg:py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
                    >
                        Login
                    </button>
                ) : (
                    <div className="relative group cursor-pointer">
                        <img
                            src={assets.profile_icon}
                            className="w-10"
                            alt=""
                        />
                        <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                            <li
                                onClick={() => navigate("/my-orders")}
                                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                            >
                                My Orders
                            </li>
                            <li
                                onClick={logout}
                                className={`p-1.5 pl-3 hover:bg-primary/10 cursor-pointer ${
                                    logoutLoading
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                }`}
                            >
                                {logoutLoading ? "Logging out..." : "Logout"}
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6 sm:hidden">
                <div
                    onClick={() => navigate("/cart")}
                    className="relative cursor-pointer"
                >
                    <img
                        src={assets.nav_cart_icon}
                        alt="cart"
                        className="w-6 opacity-80"
                    />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </button>
                </div>
                <button
                    onClick={() => (open ? setOpen(false) : setOpen(true))}
                    aria-label="Menu"
                    className="sm:hidden"
                >
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="menu" />
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div
                    className={`${
                        open ? "flex" : "hidden"
                    } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-1`}
                >
                    <NavLink to="/" onClick={() => setOpen(false)}>
                        Home
                    </NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)}>
                        All Product
                    </NavLink>
                    {user && (
                        <NavLink to="/my-orders" onClick={() => setOpen(false)}>
                            My Orders
                        </NavLink>
                    )}
                    <NavLink to="/contact" onClick={() => setOpen(false)}>
                        Contact
                    </NavLink>
                    <NavLink to="/seller" onClick={() => setOpen(false)}>
                        Seller
                    </NavLink>

                    {!user ? (
                        <button
                            onClick={() => {
                                setRedirectPath(location.pathname);
                                setOpen(false);
                                setShowUserLogin(true);
                            }}
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={logout}
                            disabled={logoutLoading}
                            className={`cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm ${
                                logoutLoading
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                            }`}
                        >
                            {logoutLoading ? "Logging out..." : "Logout"}
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
