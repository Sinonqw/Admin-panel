import React from 'react';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductListHeaderProps {
    input: string;
    setInput: (value: string) => void;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({ input, setInput }) => (
    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
            Product List
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full md:w-auto">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search..."
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full sm:w-64 transition-all duration-150"
            />
            <Button
                asChild
                className="w-full sm:w-auto flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg"
            >
                <Link href="/add-product">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                </Link>
            </Button>
        </div>
    </div>
);
export default ProductListHeader;