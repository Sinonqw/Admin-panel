import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    pageNumbers: number[];
    nextPage: () => void;
    prevPage: () => void;
    setCurrentPage: (page: number) => void; // Используем сеттер состояния
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    setCurrentPage,
}) => (
    <div className="flex justify-between items-center flex-wrap gap-2 p-2 md:p-0">
        <Button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex-shrink-0 rounded-lg bg-gray-700 hover:bg-gray-800"
        >
            Previous
        </Button>

        <div className="flex gap-1 overflow-x-auto whitespace-nowrap px-1">
            {pageNumbers.map((number) => (
                <Button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    variant={number === currentPage ? "default" : "outline"}
                    className={`w-9 h-9 text-sm flex-shrink-0 transition-colors rounded-full ${
                        number === currentPage
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                    {number}
                </Button>
            ))}
        </div>

        <Button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex-shrink-0 rounded-lg bg-gray-700 hover:bg-gray-800"
        >
            Next
        </Button>
    </div>
);
export default PaginationControls;