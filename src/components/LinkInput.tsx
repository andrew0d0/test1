
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { bypassLink } from "@/utils/api";
import { ArrowRight, Link as LinkIcon } from "lucide-react";

const LinkInput = () => {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleBypass = async () => {
    if (!link.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid link",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(link);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL format",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Attempting to bypass link:", link);
      
      // API call to backend - this is where the actual bypass logic will be integrated
      const result = await bypassLink(link);
      
      console.log("Bypass result:", result);
      
      // Navigate to results page with the data
      navigate("/results", { 
        state: { 
          originalLink: link,
          bypassedLink: result.bypassedLink 
        } 
      });
      
    } catch (error) {
      console.error("Error bypassing link:", error);
      toast({
        title: "Bypass Failed",
        description: "Unable to bypass this link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBypass();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto card-glow border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="flex items-center justify-center gap-3">
          <LinkIcon className="w-8 h-8 text-primary" />
          <CardTitle className="text-4xl font-bold">Bypass Ad Links</CardTitle>
        </div>
        <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
          Skip annoying ad links and redirects instantly with our powerful bypass tool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <div className="space-y-4">
          <Label htmlFor="link-input" className="text-lg font-semibold flex items-center gap-2">
            <span>Paste your Ad Link here</span>
          </Label>
          <div className="relative">
            <Input
              id="link-input"
              type="url"
              placeholder="https://example.com/your-ad-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-14 text-lg px-6 bg-input/50 border-border/50 focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
              disabled={isLoading}
            />
          </div>
        </div>
        <Button
          onClick={handleBypass}
          disabled={isLoading || !link.trim()}
          className="w-full h-14 text-lg font-bold button-glow bg-primary hover:bg-primary/90 transition-all duration-200"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Bypassing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Bypass Link
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Supports Linkvertise, AdFly, and other popular ad link services
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/70">
            <span>✓ Fast</span>
            <span>✓ Secure</span>
            <span>✓ Anonymous</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkInput;
