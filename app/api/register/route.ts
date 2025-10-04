// /app/api/register/route.ts
import { NextResponse } from "next/server";

// ✅ Импорт CommonJS модулей (без .default)
const connectDB = require("@/lib/connectDb"); 
const User = require("@/models/User"); 

export async function POST(request: Request) {
  try {
    // Теперь connectDB должен быть функцией
    await connectDB(); 

    const data = await request.json(); 

    // Проверка на существование пользователя
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    // Создаем пользователя (пароль будет захэширован хуком pre-save)
    const newUser = new User(data);
    await newUser.save();

    return NextResponse.json(
      { message: "Демо-пользователь создан", email: newUser.email },
      { status: 201 }
    );
  } catch (error) {
    // В случае ошибки 500, информация выводится здесь
    console.error("Error creating user:", error); 
    return NextResponse.json(
      { error: "Не удалось создать пользователя. Проверьте консоль сервера." },
      { status: 500 }
    );
  }
}