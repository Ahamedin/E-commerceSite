import { Link, useResolvedPath } from "react-router-dom";
import { ShoppingBagIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import ThemeSelector from "../components/ThemeSelector";
import { useProductStore } from "../store/useProductStore";
import { useEffect, useState } from "react";

function Navbar() {
  const { pathname } = useResolvedPath();
  const isHomePage = pathname === "/";
  const { products } = useProductStore();

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.displayName) setUser(data);
      })
      .catch((err) => console.error("User fetch error:", err));
  }, []);

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* Logo */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-9 text-primary" />
                <span className="font-semibold font-mono tracking-widest text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  POSGRESTORE
                </span>
              </div>
            </Link>
          </div>

          {/* Right-side buttons */}
          <div className="flex items-center gap-4">
            <ThemeSelector />

            {/* 🟢 Show Google Login/Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.photos?.[0]?.value}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{user.displayName}</span>
                <a
                  href="http://localhost:5000/auth/logout"
                  className="btn btn-sm btn-outline"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="http://localhost:5000/auth/google"
                className="btn btn-sm btn-primary"
              >
                Login with Google
              </a>
            )}

            {/* Bag icon only on Home */}
            {isHomePage && (
              <div className="indicator">
                <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingBagIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    {products.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
