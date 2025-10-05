import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
}

interface ProductTableProps {
    products: Product[];
    handleDelete: (id: string) => void;
}

const ProductMobileCards: React.FC<ProductTableProps> = ({ products, handleDelete }) => (
    <div className="md:hidden space-y-3">
        {products.map((product) => (
            <div
                key={product._id}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-bold text-gray-900 pr-4 leading-tight">
                        {product.name}
                    </span>
                    <span className="text-xl font-extrabold text-indigo-600 flex-shrink-0">
                        ${product.price}
                    </span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 pt-2 mb-4 border-t border-gray-100">
                    <span>Stock quantity:</span>
                    <span className="font-semibold text-gray-800">
                        {product.stock} pcs.
                    </span>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        onClick={() => handleDelete(product._id)}
                        variant="destructive"
                        className="px-3 py-1 h-9 text-sm rounded-lg"
                    >
                        Delete
                    </Button>
                    <Button
                        asChild
                        className="px-3 py-1 h-9 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg"
                    >
                        <Link href={`/products/edit/${product._id}`}>Edit</Link>
                    </Button>
                </div>
            </div>
        ))}
    </div>
);
export default ProductMobileCards;