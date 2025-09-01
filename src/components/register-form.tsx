"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/MaterialInput";
import { useState } from "react";
import { CalendarInput } from "./ui/calender-input";
import { toast } from "sonner";
import { signIn, getSession } from "next-auth/react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState<string>("");

  const handleGetOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "signup" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setIsClicked(true);
      toast.success("OTP sent successfully!", {
        description: "Check your email",
      });
    } catch (err: any) {
      toast.error("Error sending OTP", {
        description: err.message || "Something went wrong",
      });
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
          fullName,
          dob,
          purpose: "signup",
          rememberMe: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("token", data.token);
      toast.success("Signup successful!", {
        description: "Redirecting to home...",
      });
      setTimeout(() => (window.location.href = "/home"), 1000);
    } catch (err: any) {
      toast.error("Signup failed", {
        description: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
  try {
    const res = await signIn("google", { redirect: false });
    if (res?.error) throw new Error(res.error);

    const session = await getSession();
    if (!session?.customToken) throw new Error("No token returned");

    localStorage.setItem("token", session.customToken);
    window.location.href = "/home";
  } catch (err: any) {
    console.error(err);
  }
};

  return (
    <form
      onSubmit={isClicked ? handleSubmit : (e) => e.preventDefault()}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center lg:items-start gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign up to enjoy the feature of HD.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <MaterialInput
            id="name"
            type="text"
            label="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <MaterialInput
            id="email"
            type="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CalendarInput
            label="Date of Birth"
            className="h-12"
            required
            onChange={(date: Date) => setDob(date.toISOString())}
          />
        </div>

        {isClicked ? (
          <>
            <MaterialInput
              id="otp"
              label="OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg"
            >
              {loading ? "Signing up..." : "Sign up"}
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
          type="button"
          variant="outline"
          className="w-full h-12"
          onClick={handleGoogleSignIn}
        >
          <img src="./google.svg" width={28} height={28} alt="Google" /> Sign up
          with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a
          href="/login"
          className="underline underline-offset-4 text-blue-600 font-semibold cursor-pointer"
        >
          Sign in
        </a>
      </div>
    </form>
  );
}
