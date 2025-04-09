import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login - CMBT Scheduling System",
  description: "Login to access the CMBT Scheduling System",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute top-6 left-36 gap-2 md:justify-start">
          <div className="flex items-center gap-4 font-medium">
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img
                src="/images/cmbt.png"
                alt="NEUST Logo"
                className="size-20 z-10"
              />
            </div>
            <h2 className="z-10 text-2xl font-bold">
              College of Management and Business Technology
            </h2>
          </div>
        </div>
        <img
          src="/images/santoriniStairs.png"
          alt="CMBT Campus"
          className="absolute inset-0 z-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
