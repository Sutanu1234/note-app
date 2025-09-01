"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/MaterialInput";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleGetOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      toast.success("OTP sent!", {
        description: "Check your email for the code",
      });
      setIsClicked(true);
    } catch (err: any) {
      toast.error("Error", { description: err.message });
      console.error("request-otp error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otp,
          purpose: "login",
          rememberMe,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      toast.success("Login successful!", {
        description: "Redirecting to home...",
      });

      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
    } catch (err: any) {
      toast.error("Login failed", { description: err.message });
      console.error("verify-otp error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={isClicked ? handleSubmit : (e) => e.preventDefault()}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center lg:items-start gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Please login to continue to your account.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <MaterialInput
            id="email"
            type="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {isClicked ? (
          <>
            <div className="grid gap-3 relative">
              <MaterialInput
                id="otp"
                label="OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              {/* Resend OTP */}
              <button
                type="button"
                className="text-sm text-blue-600 font-medium underline text-left cursor-pointer"
                onClick={handleGetOtp}
                disabled={loading}
              >
                Resend OTP
              </button>

              {/* Keep me logged in */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="keepLoggedIn"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(!!c)}
                />
                <label
                  htmlFor="keepLoggedIn"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Keep me logged in
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg"
            >
              {loading ? "Signing in..." : "Signin"}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            disabled={loading}
            onClick={handleGetOtp}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg"
          >
            {loading ? "Sending..." : "Get OTP"}
          </Button>
        )}

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full h-12"
          onClick={() => toast.info("Google signin not yet implemented")}
        >
          <img src="./google.svg" width={28} height={28} />
          Signin with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Need an account?{" "}
        <a
          href="/register"
          className="underline underline-offset-4 text-blue-600 font-semibold cursor-pointer"
        >
          Create one
        </a>
      </div>
    </form>
  );
}
