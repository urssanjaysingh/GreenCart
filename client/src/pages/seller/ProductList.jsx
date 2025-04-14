import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
    const { products, currency, axios, fetchProducts } = useAppContext();

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
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, Please try again.");
            }
        }
    };

    const deleteProduct = async (id) => {
        try {
            const { data } = await axios.delete(`/api/product/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, Please try again.");
            }
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>

                <div className="w-full overflow-x-auto bg-white border border-gray-500/20 rounded-md">
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
                                                checked={product.inStock}
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
                                                deleteProduct(product._id)
                                            }
                                            className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Delete buttons below table */}
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
                                onClick={() => deleteProduct(product._id)}
                                className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
