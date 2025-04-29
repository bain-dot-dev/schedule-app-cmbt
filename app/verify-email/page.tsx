import { Suspense } from "react";
import VerifyEmailClient from "@/components/verify-email/verify-email-modal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Email Verification
              </CardTitle>
              <CardDescription className="text-center">
                Loading verification...
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
}
