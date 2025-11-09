import { Link, useLocation } from "react-router-dom";
import { Activity, User } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const location = useLocation();
  const isAuth = location.pathname.startsWith("/auth");
  
  if (isAuth) return null;

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-[13px] p-2 group-hover:shadow-[0_8px_24px_rgba(45,137,239,0.15)] transition-all duration-200">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              MediLink
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="rounded-[13px]">
                Dashboard
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="btn-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
