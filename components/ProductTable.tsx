import React from 'react';
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

const ProductTable: React.FC<ProductTableProps> = ({ products, handleDelete }) => (
    <div className="hidden md:block">
        <div className="overflow-x-auto">
            <Table className="min-w-full">
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="py-3 px-4 text-gray-600 font-semibold w-1/3">Name</TableHead>
                        <TableHead className="py-3 px-4 w-1/6 text-center text-gray-600 font-semibold">Price ($)</TableHead>
                        <TableHead className="py-3 px-4 w-1/6 text-center text-gray-600 font-semibold">Stock</TableHead>
                        <TableHead className="py-3 px-4 w-1/4 text-right text-gray-600 font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product._id} className="hover:bg-gray-50 transition-colors border-b">
                            <TableCell className="font-medium py-3 px-4 text-gray-900 truncate">{product.name}</TableCell>
                            <TableCell className="text-center py-3 px-4 text-gray-700">{product.price}</TableCell>
                            <TableCell className="text-center py-3 px-4 text-gray-700">{product.stock}</TableCell>
                            <TableCell className="text-right py-3 px-4">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={() => handleDelete(product._id)}
                                        variant="destructive"
                                        className="px-3 py-1.5 h-auto text-sm rounded-md"
                                    >
                                        Delete
                                    </Button>
                                    <Button asChild className="px-3 py-1.5 h-auto text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md">
                                        <Link href={`/products/edit/${product._id}`}>
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);
export default ProductTable;