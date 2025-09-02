"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/MaterialInput";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn, getSession } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Request OTP
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
      toast.success("OTP sent!", { style: { background: "#16a34a", color: "#fff" } });
      setIsClicked(true);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error sending OTP", { style: { background: "#dc2626", color: "#fff" } });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
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
      toast.success("Login successful!", { style: { background: "#16a34a", color: "#fff" } });
      setTimeout(() => (window.location.href = "/home"), 1000);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Login failed", { style: { background: "#dc2626", color: "#fff" } });
    } finally {
      setLoading(false);
    }
  };

  // Google login using NextAuth
  const handleGoogleSignIn = async () => {
    try {
      const res = await signIn("google", { redirect: false });
      if (res?.error) throw new Error(res.error);

      const session = (await getSession()) as { customToken?: string };
      if (!session?.customToken) throw new Error("No token returned");

      localStorage.setItem("token", session.customToken);
      console.log("Google login successful, token stored.", session.customToken);
      window.location.href = "/home";
      toast.success("Login successful!", { style: { background: "#16a34a", color: "#fff" } });
    } catch (err: unknown) {
      console.error(err);
      toast.error("Login failed", { style: { background: "#dc2626", color: "#fff" } });
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
        <MaterialInput
          id="email"
          type="email"
          label="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {isClicked && (
          <>
            <div className="flex flex-col gap-2 items-start relative">
              <MaterialInput
                id="otp"
                label="OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                type="button"
                className="text-sm text-blue-600 font-medium underline cursor-pointer"
                onClick={handleGetOtp}
                disabled={loading}
              >
                Resend OTP
              </button>

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
        )}

        {!isClicked && (
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
          type="button"
          variant="outline"
          className="w-full h-12 flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <img src="./google.svg" width={28} height={28} alt="Google" />
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
