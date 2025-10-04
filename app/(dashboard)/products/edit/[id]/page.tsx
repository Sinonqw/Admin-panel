"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditProductPage() {
  const params = useParams();
  console.log(params);

  const productId = params.id as string;
  const router = useRouter();

  const {
    data: product,
    error,
    isLoading,
  } = useSWR(`/api/products/${productId}`, fetcher);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price?.toString() || "");
      setStock(product.stock?.toString() || "");
    }
  }, [product]);

  if (error)
    return (
      <div className="text-red-500">
        Ошибка: Не удалось загрузить данные товара.
      </div>
    );
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-3 text-lg">Загрузка данных товара...</span>
      </div>
    );
  if (!product) return <div>Товар не найден.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const productData = {
      name: name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    };

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      }

      console.log("Товар успешно обновлен!");
      toast.success("товар успешно обновлен!")
      router.push("/products");
    } catch (error) {
      console.error("Не удалось обновить товар:", (error as Error).message);
      toast.error("Не удалось обновить товар")
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-6">
        Редактировать товар: {product.name}
      </h2>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Обновить информацию</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Название
              </label>
              <Input
                id="name"
                placeholder="Введите название товара"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Цена ($)
              </label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Количество на складе
              </label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить изменения"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
