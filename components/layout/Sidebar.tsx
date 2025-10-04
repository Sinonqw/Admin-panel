'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, PlusCircle, LayoutDashboard } from "lucide-react";

// TODO: Обернуть в 'use client' для использования usePathname
export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/products",
      label: "Товары",
      icon: Package,
    },
    {
      href: "/add-product",
      label: "Добавить товар",
      icon: PlusCircle,
    },
    // TODO: Добавить другие страницы
  ];

  return (
    <nav className="hidden md:flex flex-col w-64 border-r bg-white p-4">
      <div className="text-2xl font-bold mb-8 text-indigo-600">
        Dashboard
      </div>
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}