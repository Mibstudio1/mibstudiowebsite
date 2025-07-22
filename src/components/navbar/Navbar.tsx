"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser } from "@/store/authSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(setUser({}));
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-wrap justify-between items-center bg-black h-auto md:h-18 px-4 md:px-10 py-2 text-white shadow-lg">
      {/* logo */}
      <div className="flex justify-center items-center gap-3 md:gap-5 w-full md:w-auto md:mb-0">
        <img
          src="/logo.png"
          alt="MIB Studio Logo"
          width="60"
          height="60"
          className="object-contain"
        />
        <div className="flex justify-center items-center gap-4 md:flex-col md:justify-start md:items-start md:gap-0">
          <div className="font-bold text-base md:text-lg text-white">
            MIB Studio
          </div>
          <div className="text-xs md:text-sm text-gray-300">
            Professional Architectural & Construction Services
          </div>
        </div>
      </div>

      {/* menu */}
      <div className="relative">
        <ul className="flex gap-6 relative">
          {[
            { href: "/timeline", label: "Timeline" },
            { href: "/notes", label: "Client Note" },
          ].map(({ href, label }) => (
            <li key={href} className="relative">
              <Link
                href={href}
                className={`relative pb-1 transition-colors duration-300 ${
                  pathname === href
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
              >
                {label}
                {pathname === href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transition-all duration-500" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* user info */}
      {user ? (
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 w-full md:w-auto">
          <div className="text-sm text-white text-center md:text-left">
            {user.customerId} คุณ {user.name}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            ออกจากระบบ
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
