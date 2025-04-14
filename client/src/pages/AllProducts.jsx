import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { assets } from "../assets/assets";
import Loader from "./../components/Loader";

const AllProducts = () => {
    const { products, isProductsLoading, searchQuery, setSearchQuery } =
        useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setFilteredProducts(
                products.filter((product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredProducts(products);
        }
    }, [products, searchQuery]);

    return (
        <div className="mt-16 flex flex-col">
            <div className="flex flex-col items-end w-max">
                <p className="text-2xl font-medium uppercase">All Products</p>
                <div className="w-16 h-0.5 bg-primary rounded-full"></div>
            </div>

            {/* Search bar (visible on small screens) */}
            <div className="flex mt-5 mx-auto flex-1 items-center text-sm gap-2 border border-gray-300 px-3 rounded-full min-w-[200px] sm:min-w-[300px] max-w-[90%] lg:hidden">
                <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-sm"
                    type="text"
                    placeholder="Search products"
                />
                <img
                    src={assets.search_icon}
                    alt="search"
                    className="w-4 h-4"
                />
            </div>

            {/* Loading / No Products / Product Grid */}
            <div className="mt-6">
                {isProductsLoading ? (
                    <Loader />
                ) : filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No products found.
                    </p>
                ) : (
                    <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 gap-x-4">
                        {filteredProducts
                            .filter((product) => product.inStock)
                            .map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;
