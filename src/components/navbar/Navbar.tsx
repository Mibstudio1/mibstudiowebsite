"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser } from "@/store/authSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(setUser({}));
    router.push("/");
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const isHomePage = pathname === "/";
  const isTimelinePage = pathname.startsWith("/timeline");
  const isNotesPage = pathname.startsWith("/notes");

  return (
    <div className="bg-black text-white shadow-2xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="MIB Studio Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="hidden md:block">
              <div className="text-lg font-bold text-white">MIB Studio</div>
              <div className="text-xs text-gray-300">Professional Services</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleHomeClick}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isHomePage
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Home
            </button>
            
            <Link
              href="/timeline"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isTimelinePage
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Timeline
            </Link>
            
            <Link
              href="/notes"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isNotesPage
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Client Notes
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && user.name ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-300">
                    {user.companyName || "Client"}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={handleHomeClick}
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
              isHomePage
                ? "bg-white text-black"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Home
          </button>
          <Link
            href="/timeline"
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
              isTimelinePage
                ? "bg-white text-black"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Timeline
          </Link>
          <Link
            href="/notes"
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
              isNotesPage
                ? "bg-white text-black"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Client Notes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
