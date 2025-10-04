import connectDB from "../../../lib/connectDb";
import Product from "../../../models/Product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/route";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  let query = {};

  if(search){
    query = {
      name: {
        $regex: search,
        $options: "i",
      }
    }
  }

  try {
    await connectDB();

    const products = await Product.find(query)
      .skip((currentPage - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json({products: products, totalProducts: totalProducts}, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const data = await request.json();

    if (
      typeof data.name !== "string" ||
      typeof data.price !== "number" ||
      typeof data.stock !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    const newProduct = new Product(data);
    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
