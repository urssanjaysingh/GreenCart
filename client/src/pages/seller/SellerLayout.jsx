import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const { seller, setSeller, navigate, axios } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        {
            name: "Product List",
            path: "/seller/product-list",
            icon: assets.product_list_icon,
        },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.delete("/api/user/logout");
            if (data.success) {
                toast.success(data.message);
                setSeller(null);
                navigate("/seller");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <Link to="/">
                    <img
                        src={assets.logo}
                        alt="logo"
                        className="cursor-pointer w-34 md:w-38"
                    />
                </Link>
                <div className="flex items-center gap-4 sm:gap-6 text-gray-600 text-sm">
                    <p className="font-medium hidden sm:block">
                        Hi! {seller.name}
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer px-4 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-300"
                    >
                        Home
                    </button>

                    <button
                        onClick={logout}
                        className="cursor-pointer px-4 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="flex">
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
                    {sidebarLinks.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            end={item.path === "/seller"}
                            className={({ isActive }) =>
                                `flex items-center py-3 px-4 gap-3 ${
                                    isActive
                                        ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                        : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <img src={item.icon} alt="" className="w-7 h-7" />
                            <p className="md:block hidden text-center">
                                {item.name}
                            </p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>
        </>
    );
};

export default SellerLayout;
