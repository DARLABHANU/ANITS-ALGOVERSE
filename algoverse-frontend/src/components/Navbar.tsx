import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  hideSignUpButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideSignUpButton = false }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState([0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check auth status on component mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    
    if (token) {
      setIsLoggedIn(true);
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }

    // Theme setup (existing code)
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === "dark" || (savedTheme === null && prefersDark)) {
      setIsDarkTheme(true);
      setSliderValue([100]);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkTheme(false);
      setSliderValue([0]);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      duration: 3000,
    });
    navigate("/");
  };

  const handleThemeChange = (value: number[]) => {
    const isDark = value[0] === 100;
    setIsDarkTheme(isDark);
    setSliderValue(value);

    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg py-4 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold gradient-text leading-none tracking-tight">AlgoVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <Link
              to="/about"
              className={`text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left ${location.pathname === '/about' ? 'text-primary after:scale-x-100' : ''}`}
            >
              About
            </Link>
            <Link
              to="/help"
              className={`text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left ${location.pathname === '/help' ? 'text-primary after:scale-x-100' : ''}`}
            >
              Help
            </Link>
            <Link
              to="/contact"
              className={`text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left ${location.pathname === '/contact' ? 'text-primary after:scale-x-100' : ''}`}
            >
              Contact
            </Link>
          </div>

          {/* Right-hand side: Theme toggle and Auth buttons */}
          <div className="flex items-center space-x-5">
            {/* Theme Toggle Slider */}
            <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-full">
              <Sun className="h-4 w-4 text-amber-500" />
              <Slider
                value={sliderValue}
                max={100}
                step={100}
                onValueChange={handleThemeChange}
                className="w-12"
              />
              <Moon className="h-4 w-4 text-indigo-400" />
            </div>

            {/* Desktop Auth Buttons - Updated for logged in state */}
            <div className="hidden sm:flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    Welcome, {username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                !hideSignUpButton && (
                  <Link to="/signup">
                    <Button variant="outline" size="sm" className="rounded-full border-primary/50 hover:border-primary hover:bg-primary/10">
                      Sign Up
                    </Button>
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="flex md:hidden items-center justify-center p-2 rounded-md text-foreground hover:bg-muted/50"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Updated for logged in state */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 px-2 space-y-3 border-t border-border/30 mt-4">
            <Link
              to="/about"
              className="block py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
            >
              About
            </Link>
            <Link
              to="/help"
              className="block py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
            >
              Help
            </Link>
            <Link
              to="/contact"
              className="block py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
            >
              Contact
            </Link>
            <div className="flex space-x-3 mt-4 pt-4 border-t border-border/30">
              {isLoggedIn ? (
                <>
                  <div className="flex-1 flex items-center justify-center text-sm font-medium">
                    <UserIcon className="h-4 w-4 mr-1" />
                    Welcome, {username}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                !hideSignUpButton && (
                  <Link to="/signup" className="flex-1">
                    <Button variant="outline" className="w-full">Sign Up</Button>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;