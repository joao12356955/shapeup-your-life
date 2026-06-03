import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import bgAsset from "@/assets/shapeup-bg-dashboard.png.asset.json";
import heroLogo from "@/assets/shapeup-logo-hero.png.asset.json";
import featuresImg from "@/assets/shapeup-features.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShapeUp — Track your progress. Shape your future." },
      { name: "description", content: "Acompanhe seus treinos, dieta e evolução em um único app." },
      { property: "og:title", content: "ShapeUp" },
      { property: "og:description", content: "Track your progress. Shape your future." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-background bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgAsset.url})` }}
    >
      <div className="min-h-screen bg-background/40 backdrop-blur-[2px]">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left — Brand */}
          <div className="flex flex-col justify-center items-center p-6 lg:p-12">
            <div className="max-w-lg w-full space-y-8">
              <img
                src={heroLogo.url}
                alt="ShapeUp — Track your progress. Shape your future."
                className="w-full h-auto drop-shadow-[0_0_40px_oklch(0.55_0.25_295/40%)]"
              />
              <img
                src={featuresImg.url}
                alt="Track. Improve. Achieve."
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right — Login */}
          <div className="flex items-center justify-center p-6 lg:p-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/dashboard" });
              }}
              className="w-full max-w-md rounded-2xl border border-primary/30 bg-card/70 backdrop-blur-xl p-8 lg:p-10 shadow-elegant space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold">Welcome back</h2>
                <p className="mt-1 text-muted-foreground">Log in to continue your journey</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-lg bg-input border border-border pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-lg bg-input border border-border pl-10 pr-10 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="text-right">
                  <a href="#" className="text-xs text-primary-glow hover:underline">Forgot password?</a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition"
              >
                Log In <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                OR
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 py-2.5 text-sm font-medium hover:bg-secondary transition">
                  <span className="h-4 w-4 rounded-full bg-white text-[10px] font-bold text-black flex items-center justify-center">G</span>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 py-2.5 text-sm font-medium hover:bg-secondary transition">
                   Apple
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                New here?{" "}
                <Link to="/dashboard" className="text-primary-glow font-medium hover:underline">
                  Create an account →
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
