
import Header from "@/components/Header";
import LinkInput from "@/components/LinkInput";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
        <div className="w-full max-w-4xl space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Skip the Wait,
              <br />
              <span className="gradient-text">Get Direct Links</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bypass annoying ad links instantly. No more waiting, no more redirects.
              <br />
              <span className="text-foreground font-medium">Just paste your link and get direct access.</span>
            </p>
          </div>

          {/* Main Input Component */}
          <LinkInput />

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            <div className="text-center space-y-4 p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-primary-foreground font-bold text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Bypass links in seconds, not minutes. Our optimized system ensures instant results.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-primary-foreground font-bold text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold">Safe & Secure</h3>
              <p className="text-muted-foreground">
                No data stored, complete privacy protection. Your links stay private and secure.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-primary-foreground font-bold text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold">Works Everywhere</h3>
              <p className="text-muted-foreground">
                Desktop, mobile, tablet - fully responsive design that works on any device.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
