"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LogOut } from "lucide-react"; 

export function Header() {
  const { data: session } = useSession();

  if (!session) {
    return null; 
  }

  const handleSignOut = () => {
    if(session){
      signOut();
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-6 md:px-8">
        <h1 className="text-xl font-semibold text-gray-800">Admin-Panel</h1>
        
        <button 
          onClick={handleSignOut} 
          className="
            flex 
            items-center 
            space-x-2 
            text-red-600 
            border 
            border-red-600 
            font-medium 
            py-1.5 
            px-4 
            rounded-lg 
            hover:bg-red-50 
            transition 
            duration-150
            cursor-pointer
          "
        >
          <LogOut className="w-5 h-5" />
          <span>LogOut</span>
        </button>

      </div>
    </header>
  );
}