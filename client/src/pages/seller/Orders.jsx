import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get("/api/order/seller");

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch orders"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (orderId) => {
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { data } = await axios.delete(
                `/api/order/${selectedOrderId}`
            );
            if (data.success) {
                toast.success(data.message);
                setOrders((prev) =>
                    prev.filter((o) => o._id !== selectedOrderId)
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete the order"
            );
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { data } = await axios.patch(`/api/order/${orderId}`, {
                status: newStatus,
            });

            if (data.success) {
                toast.success("Status updated");
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update status"
            );
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>

                {isLoading ? (
                    <Loader />
                ) : orders.length === 0 ? (
                    <p className="text-gray-600 mt-4">No orders found.</p>
                ) : (
                    orders.map((order, index) => (
                        <div
                            key={index}
                            className="flex flex-col xl:flex-row gap-5 xl:items-center justify-between p-5 border border-gray-300 rounded-md w-full"
                        >
                            {/* Product Items */}
                            <div className="flex gap-4 max-w-full xl:max-w-80 w-full">
                                <img
                                    className="w-12 h-12 object-cover flex-shrink-0"
                                    src={assets.box_icon}
                                    alt="boxIcon"
                                />
                                <div className="flex-1">
                                    {order.items
                                        .filter((item) => item.product)
                                        .map((item, i) => (
                                            <p
                                                key={i}
                                                className="text-sm font-medium"
                                            >
                                                {item.product.name}{" "}
                                                <span className="text-primary">
                                                    x {item.quantity}
                                                </span>
                                            </p>
                                        ))}
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="text-sm md:text-base text-black/60 w-full xl:w-1/4">
                                <p className="text-black/80">
                                    {order.address?.firstName}{" "}
                                    {order.address?.lastName}
                                </p>
                                <p>
                                    {order.address?.street},{" "}
                                    {order.address?.city}
                                </p>
                                <p>
                                    {order.address?.state},{" "}
                                    {order.address?.zipcode},{" "}
                                    {order.address?.country}
                                </p>
                                <p>{order.address?.phone}</p>
                            </div>

                            {/* Amount */}
                            <p className="font-medium text-lg w-full xl:w-fit text-center xl:text-left">
                                {currency}
                                {order.amount}
                            </p>

                            {/* Payment & Status */}
                            <div className="flex flex-col text-sm md:text-base text-black/60 w-full xl:w-1/5">
                                <p>Method: {order.paymentType}</p>
                                <p>
                                    Date:{" "}
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    Payment: {order.isPaid ? "Paid" : "Pending"}
                                </p>

                                {/* Status Select */}
                                <div className="mt-2">
                                    <label
                                        htmlFor={`status-${order._id}`}
                                        className="block text-black/80 mb-1 text-sm"
                                    >
                                        Status:
                                    </label>
                                    <select
                                        id={`status-${order._id}`}
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    >
                                        <option value="Order Placed">
                                            Order Placed
                                        </option>
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">
                                            Delivered
                                        </option>
                                        <option value="Cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => confirmDelete(order._id)}
                                className="text-red-500 border cursor-pointer border-red-500 px-3 py-1 rounded-md hover:bg-red-100 transition w-full sm:w-auto"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Deletion
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this order? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 cursor-pointer rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className={`px-4 py-2 cursor-pointer rounded-md bg-red-500 text-white transition ${
                                    isDeleting
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-red-600"
                                }`}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
