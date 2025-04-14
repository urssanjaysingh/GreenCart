import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
    const { products, currency, axios, fetchProducts, isProductsLoading } =
        useAppContext();

    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleStock = async (id, inStock) => {
        try {
            const { data } = await axios.patch(`/api/product/${id}`, {
                inStock,
            });
            if (data.success) {
                fetchProducts();
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Something went wrong, Please try again."
            );
        }
    };

    const confirmDelete = (id) => {
        setSelectedProductId(id);
        setShowModal(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { data } = await axios.delete(
                `/api/product/${selectedProductId}`
            );
            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>

                {isProductsLoading ? (
                    <div className="w-full bg-white border border-gray-300 rounded-md p-6 text-center text-gray-600">
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="w-full bg-white border border-gray-300 rounded-md p-6 text-center text-gray-600">
                        No products found.
                    </div>
                ) : (
                    <>
                        {/* Product Table */}
                        <div className="w-full overflow-x-auto bg-white border border-gray-300 rounded-md">
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-100 text-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                                            Product
                                        </th>
                                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 font-semibold whitespace-nowrap hidden md:table-cell">
                                            Selling Price
                                        </th>
                                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                                            In Stock
                                        </th>
                                        <th className="px-4 py-3 font-semibold whitespace-nowrap hidden sm:table-cell">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td className="px-4 py-3 flex items-center space-x-3 min-w-[200px]">
                                                <div className="border border-gray-300 rounded p-1">
                                                    <img
                                                        src={product.image[0]}
                                                        alt="Product"
                                                        className="w-12 h-12 object-cover"
                                                    />
                                                </div>
                                                <span className="truncate max-w-[150px] sm:max-w-xs">
                                                    {product.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {product.category}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell whitespace-nowrap">
                                                {currency}
                                                {product.offerPrice}
                                            </td>
                                            <td className="px-4 py-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        onChange={() =>
                                                            toggleStock(
                                                                product._id,
                                                                !product.inStock
                                                            )
                                                        }
                                                        checked={
                                                            product.inStock
                                                        }
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                                </label>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <button
                                                    onClick={() =>
                                                        confirmDelete(
                                                            product._id
                                                        )
                                                    }
                                                    className="text-sm cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Delete Buttons */}
                        <div className="sm:hidden mt-4 space-y-2">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex justify-between items-center px-4 py-2 border rounded shadow-sm"
                                >
                                    <span className="text-sm font-medium truncate">
                                        {product.name}
                                    </span>
                                    <button
                                        onClick={() =>
                                            confirmDelete(product._id)
                                        }
                                        className="text-xs cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Deletion
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this product? This
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

export default ProductList;
