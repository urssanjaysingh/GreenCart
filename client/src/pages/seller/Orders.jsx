import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";

const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/seller");

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    const confirmDelete = (orderId) => {
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(
                `/api/order/${selectedOrderId}`
            );
            if (data.success) {
                toast.success(data.message);
                setOrders((prev) =>
                    prev.filter((o) => o._id !== selectedOrderId)
                );
                setShowModal(false);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete the order"
            );
            setShowModal(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 max-w-4xl rounded-md border border-gray-300"
                    >
                        <div className="flex gap-5 max-w-80">
                            <img
                                className="w-12 h-12 object-cover"
                                src={assets.box_icon}
                                alt="boxIcon"
                            />
                            <div>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex flex-col">
                                        <p className="font-medium">
                                            {item.product.name}{" "}
                                            <span className="text-primary">
                                                x {item.quantity}
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-black/60">
                            <p className="text-black/80">
                                {order.address.firstName}{" "}
                                {order.address.lastName}
                            </p>

                            <p>
                                {order.address.street}, {order.address.city},{" "}
                            </p>

                            <p>
                                {order.address.state},{order.address.zipcode},{" "}
                                {order.address.country}
                            </p>
                            <p></p>
                            <p>{order.address.phone}</p>
                        </div>

                        <p className="font-medium text-lg my-auto">
                            {currency}
                            {order.amount}
                        </p>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Method: {order.paymentType}</p>
                            <p>
                                Date:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                        </div>

                        <button
                            onClick={() => confirmDelete(order._id)}
                            className="text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-100 transition text-sm md:text-base"
                        >
                            Delete
                        </button>
                    </div>
                ))}
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
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
