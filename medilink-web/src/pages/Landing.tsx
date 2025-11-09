import { Link } from "react-router-dom";
import { ArrowRight, Upload, Stethoscope, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Landing = () => {
  const features = [
    {
      icon: Upload,
      title: "Smart Prescription OCR",
      description: "Upload prescriptions and get instant digital records with AI-powered text extraction"
    },
    {
      icon: Shield,
      title: "Drug Safety Alerts",
      description: "Real-time warnings about drug interactions and contraindications"
    },
    {
      icon: Clock,
      title: "Medicine Reminders",
      description: "Never miss a dose with intelligent scheduling and timely notifications"
    },
    {
      icon: Stethoscope,
      title: "Symptom Checker",
      description: "AI-powered symptom analysis with preliminary health insights"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  AI-Powered Healthcare
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                Smart Health.
                <br />
                <span className="text-primary">Simplified.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Your intelligent healthcare companion for managing prescriptions, 
                drug safety, and health reminders—all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="btn-primary text-lg w-full sm:w-auto group">
                    Upload Prescription
                    <Upload className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg rounded-[13px] w-full sm:w-auto group">
                    Check Symptoms
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent rounded-[21px] backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="bg-card rounded-[13px] p-8 shadow-[0_8px_24px_rgba(45,137,239,0.15)]">
                    <Stethoscope className="h-32 w-32 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium">Your Health Assistant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare management tools powered by artificial intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-soft card-hover bg-card p-8 text-center"
                >
                  <div className="bg-primary/10 rounded-[13px] w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-soft bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent p-12 sm:p-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users managing their health smarter with MediLink
            </p>
            <Link to="/auth">
              <Button size="lg" className="btn-primary text-lg">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 MediLink. Smart Health Companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
