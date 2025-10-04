"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 💡 НОВОЕ: Интерфейс для избежания 'any'
interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getInitialPage = () => {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get("page");
  return parseInt(pageParam as string) || 1;
};

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(input);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  useEffect(() => {
    // 💡 ИСПРАВЛЕНИЕ (47:6): Добавление 'currentPage' в зависимости
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, currentPage]); 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(currentPage));

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`);
  }, [currentPage, router, searchQuery]);

  const { data, error, isLoading, mutate } = useSWR(
    `api/products?page=${currentPage}&limit=10${
      searchQuery ? `&search=${searchQuery}` : ""
    }`,
    fetcher
  );

  if (status === "loading") {
    return <div className="p-6">Loading user data...</div>;
  }

  if (error)
    return <div className="p-6 text-red-600">Error loading data</div>;

  const { products, totalProducts } = (data || {
    products: [],
    totalProducts: 0,
  }) as { products: Product[], totalProducts: number };

  const totalPages = Math.ceil(totalProducts / 10);

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure?"); 
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error deleting product");
        }

        mutate();
        toast.success("Product successfully deleted");
      } catch (e) {
        console.error(e);
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full overflow-x-hidden">
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
          <Button asChild className="w-full sm:w-auto flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg">
            <Link href="/add-product">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white p-2 md:p-6 rounded-xl shadow-lg mb-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-gray-500 font-medium">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading products...
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 text-gray-500 font-medium">
            <PlusCircle className="w-8 h-8 mb-2 text-gray-400" />
            No products matching the search criteria.
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="py-3 px-4 text-gray-600 font-semibold w-1/3">Name</TableHead>
                      <TableHead className="py-3 px-4 w-1/6 text-center text-gray-600 font-semibold">
                        Price ($)
                      </TableHead>
                      <TableHead className="py-3 px-4 w-1/6 text-center text-gray-600 font-semibold">
                        Stock
                      </TableHead>
                      <TableHead className="py-3 px-4 w-1/4 text-right text-gray-600 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: Product) => (
                      <TableRow key={product._id} className="hover:bg-gray-50 transition-colors border-b">
                        <TableCell className="font-medium py-3 px-4 text-gray-900 truncate">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-center py-3 px-4 text-gray-700">
                          {product.price}
                        </TableCell>
                        <TableCell className="text-center py-3 px-4 text-gray-700">
                          {product.stock}
                        </TableCell>
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

            <div className="md:hidden space-y-3">
              {products.map((product: Product) => (
                <div key={product._id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
                        <span className="font-semibold text-gray-800">{product.stock} pcs.</span>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => handleDelete(product._id)}
                            variant="destructive"
                            className="px-3 py-1 h-9 text-sm rounded-lg"
                        >
                            Delete
                        </Button>
                        <Button asChild className="px-3 py-1 h-9 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg">
                            <Link href={`/products/edit/${product._id}`}>
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {products && products.length > 0 && (
        <div className="flex justify-between items-center flex-wrap gap-2 p-2 md:p-0">
          <Button onClick={() => prevPage()} disabled={currentPage === 1} className="flex-shrink-0 rounded-lg bg-gray-700 hover:bg-gray-800">
            Previous
          </Button>

          <div className="flex gap-1 overflow-x-auto whitespace-nowrap px-1">
            {pageNumbers.map((number) => (
              <Button
                key={number}
                onClick={() => setCurrentPage(number)}
                variant={number === currentPage ? "default" : "outline"}
                className={`w-9 h-9 text-sm flex-shrink-0 transition-colors rounded-full ${
                    number === currentPage ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {number}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => nextPage()}
            disabled={currentPage === totalPages}
            className="flex-shrink-0 rounded-lg bg-gray-700 hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
