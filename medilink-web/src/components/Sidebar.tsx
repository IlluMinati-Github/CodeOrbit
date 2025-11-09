import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Bell, 
  Wind, 
  Heart, 
  Settings,
  Activity,
  Moon,
  Sun,
  Menu
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: FileText, label: "Prescriptions", path: "/dashboard/prescriptions" },
    { icon: Bell, label: "Reminders", path: "/dashboard/reminders" },
    { icon: Wind, label: "AQI Monitor", path: "/dashboard/aqi" },
    { icon: Heart, label: "First Aid", path: "/dashboard/first-aid" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 group"
          onClick={() => isMobile && setOpen(false)}
        >
          <div className="bg-primary rounded-[13px] p-2 group-hover:shadow-[0_8px_24px_rgba(45,137,239,0.15)] transition-all duration-200">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg">MediLink</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[13px] transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-5 w-5" />
              <span className="font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span className="font-medium">Dark Mode</span>
            </>
          )}
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden bg-card/50 backdrop-blur-sm border border-border rounded-[13px]"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-0 w-64 h-screen border-r border-border bg-card/50 backdrop-blur-sm z-10">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
