
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Copy, ExternalLink, CheckCircle, Link as LinkIcon } from "lucide-react";
import Header from "@/components/Header";

interface ResultsState {
  originalLink: string;
  bypassedLink: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Get the data passed from the previous page
  const state = location.state as ResultsState;

  useEffect(() => {
    // Redirect to home if no data is available
    if (!state?.originalLink || !state?.bypassedLink) {
      navigate("/");
      return;
    }
  }, [state, navigate]);

  const copyToClipboard = async () => {
    if (!state?.bypassedLink) return;
    
    try {
      await navigator.clipboard.writeText(state.bypassedLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const openLink = () => {
    if (!state?.bypassedLink) return;
    
    console.log("Opening bypassed link:", state.bypassedLink);
    window.open(state.bypassedLink, "_blank", "noopener,noreferrer");
  };

  // Don't render anything if there's no state data
  if (!state?.originalLink || !state?.bypassedLink) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Success Message */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <Badge className="bg-green-600/20 border-green-600/30 text-green-400 hover:bg-green-600/20 px-6 py-3 text-base font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Link Successfully Bypassed
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Bypass <span className="gradient-text">Complete</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your link has been processed and is ready to use. No more waiting through ads!
            </p>
          </div>

          {/* Results Card */}
          <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3">
                <LinkIcon className="w-7 h-7 text-primary" />
                <CardTitle className="text-2xl">Link Information</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Original and bypassed link details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-8">
              {/* Original Link */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-muted-foreground flex items-center gap-2">
                  <span>Original Link:</span>
                </label>
                <div className="p-4 bg-muted/50 rounded-xl border border-border/30">
                  <p className="text-sm font-mono break-all text-muted-foreground leading-relaxed">
                    {state.originalLink}
                  </p>
                </div>
              </div>

              {/* Bypassed Link */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Bypassed Link:</span>
                </label>
                <div className="p-4 bg-green-950/30 rounded-xl border border-green-800/50">
                  <p className="text-sm font-mono break-all text-green-300 leading-relaxed">
                    {state.bypassedLink}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={openLink}
                  className="flex-1 h-14 text-lg font-bold button-glow bg-primary hover:bg-primary/90 transition-all duration-200"
                  size="lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open Link
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 h-14 text-lg font-bold border-border/50 hover:bg-accent/50 transition-all duration-200"
                  size="lg"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <div className="text-center">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-lg hover:bg-accent/50 transition-all duration-200 px-8 py-3"
            >
              Bypass Another Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
