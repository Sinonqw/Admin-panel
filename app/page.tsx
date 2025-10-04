import { redirect } from 'next/navigation';

export default function HomePage() {
  // Перенаправляем пользователя сразу на страницу товаров
  redirect('/products');
}