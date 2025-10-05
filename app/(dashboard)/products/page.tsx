"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import ProductListHeader from "@/components/ProductListHeader";
import ProductTable from "@/components/ProductTable";
import ProductMobileCards from "@/components/ProductMobileCards";
import PaginationControls from "@/components/PaginationControls";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

function getInitialPage() {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page") || "1", 10);
  return isNaN(page) || page < 1 ? 1 : page;
}

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { status } = useSession();

  // 1. Debouncing effect for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(input);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  // 2. Reset page to 1 when search query changes
  useEffect(() => {
    if (searchQuery && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // 3. Auth protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 4. URL synchronization
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

  // 5. SWR Data Fetching
  const { data, error, isLoading, mutate } = useSWR(
    `api/products?page=${currentPage}&limit=10${
      searchQuery ? `&search=${searchQuery}` : ""
    }`,
    fetcher
  );

  // 6. Callback functions
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
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
    },
    [mutate]
  );
  
  // --- Data Extraction and Memoized Calculations ---
  
  const { products, totalProducts } = (data || {
    products: [],
    totalProducts: 0,
  }) as { products: Product[]; totalProducts: number };

  const totalPages = Math.ceil(totalProducts / 10);
  
  // Memoize page numbers array to ensure stable hook order
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);
  
  // --- Conditional Rendering ---

  if (status === "loading") {
    return <div className="p-6">Loading user data...</div>;
  }

  if (error) return <div className="p-6 text-red-600">Error loading data</div>;


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full overflow-x-hidden">
      {/* 1. HEADER (Search & Add) */}
      <ProductListHeader input={input} setInput={setInput} />

      <div className="bg-white p-2 md:p-6 rounded-xl shadow-lg mb-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-gray-500 font-medium">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" />
            Loading products...
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 text-gray-500 font-medium">
            <PlusCircle className="w-8 h-8 mb-2 text-gray-400" />
            No products matching the search criteria.
          </div>
        ) : (
          <>
            {/* 2. DESKTOP TABLE */}
            <ProductTable products={products} handleDelete={handleDelete} />

            {/* 3. MOBILE CARDS */}
            <ProductMobileCards
              products={products}
              handleDelete={handleDelete}
            />
          </>
        )}
      </div>

      {/* 4. PAGINATION CONTROLS */}
      {products && products.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          nextPage={nextPage}
          prevPage={prevPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
