"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  const pathname = usePathname();
  const hideOnPaths = ["/", "/login", "/timeline"];

  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  return <Navbar />;
};

export default NavbarWrapper;
