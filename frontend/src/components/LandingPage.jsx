import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Coffee,
  CreditCard,
  Code,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(120, 53, 15, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(120, 53, 15, 0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 border-b border-amber-200/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-amber-900">PayCoffee</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 border-0"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-16 text-center">
          {/* Beta badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">
              Introducing PayCoffee Beta Version
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span
              className="bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-700 bg-clip-text text-transparent"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fund Your Dreams
            </span>
            <br />
            <span
              className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              One Coffee at a Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-amber-800/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Accept payments, track donations, and engage supporters —all through
            simple
            <br />
            embeddable widgets powered by Payman.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-xl px-8 py-4 text-lg font-semibold group transition-all duration-300 hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-amber-300 bg-white/80 text-amber-800 hover:bg-amber-50 backdrop-blur-sm px-8 py-4 text-lg transition-all duration-300"
            >
              Know More
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group">
              <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-8 h-full hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-4">
                  Easy Payments
                </h3>
                <p className="text-amber-800/80 leading-relaxed">
                  Direct wallet-to-wallet payments powered by Payman's secure
                  infrastructure
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-8 h-full hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Code className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-4">
                  Simple Integration
                </h3>
                <p className="text-amber-800/80 leading-relaxed">
                  Copy-paste embed code to add payment buttons to any website
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-8 h-full hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-4">
                  Instant Setup
                </h3>
                <p className="text-amber-800/80 leading-relaxed">
                  Get started in minutes with just your Payman paytag
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="bg-gradient-to-r from-white/90 to-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-amber-900 mb-6">
              Ready to start accepting payments?
            </h2>
            <p className="text-xl text-amber-800/80 mb-8 max-w-2xl mx-auto">
              Join creators and businesses using PayCoffee to monetize their
              content with seamless Payman integration.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-xl px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Start Accepting Payments
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-amber-900">
                PayCoffee
              </span>
            </div>
            <div className="text-amber-700/70 text-sm">
              Powered by Payman • Built for creators
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
