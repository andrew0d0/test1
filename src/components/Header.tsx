
import { ArrowLeft, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          {!isHomePage && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-accent/50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-muted-foreground rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              LinkBypass
            </h1>
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Fast & Reliable Link Bypass
        </div>
      </div>
    </header>
  );
};

export default Header;
