"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/MaterialInput";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isClicked, setIsClicked] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center lg:items-start gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Please login to continue to your account.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <MaterialInput id="email" type="email" label="Email" required />
        </div>

        {isClicked ? (
          <>
            <div className="grid gap-3 relative">
              <MaterialInput
                id="otp"
                label="OTP"
                required
                showToggle={true}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg"
            >
              Signin
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() => setIsClicked(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-lg"
          >
            Get OTP
          </Button>
        )}

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full h-12">
          <img src="./google.svg" width={28} height={28} />
          Signin with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/register" className="underline underline-offset-4 text-blue-600 font-semibold">
          Sign up
        </a>
      </div>
    </form>
  );
}
