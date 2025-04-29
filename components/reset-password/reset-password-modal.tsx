"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

const formSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [isResetComplete, setIsResetComplete] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Verify token on page load
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/verify-reset-token?token=${token}`, {
          method: "GET",
        })

        setIsTokenValid(response.ok)
      } catch (error) {
        console.error("Error verifying token:", error)
        setIsTokenValid(false)
      }
    }

    verifyToken()
  }, [token])

  const onSubmit = async (data: FormValues) => {
    if (!token) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reset-password/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reset password")
      }

      setIsResetComplete(true)
      toast.success("Password reset successful", {
        description: "Your password has been reset. You can now log in with your new password.",
      })
    } catch (error) {
      console.error("Error resetting password:", error)
      toast.error("Error", {
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isTokenValid === null && (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Please wait while we verify your reset link...</p>
        </div>
      )}

      {isTokenValid === false && (
        <div className="flex flex-col items-center gap-4 p-4">
          <XCircle className="h-16 w-16 text-red-500" />
          <p className="text-center">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <Button variant="link" onClick={() => router.push("/")}>
            Back to Login
          </Button>
        </div>
      )}

      {isTokenValid === true && !isResetComplete && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
            <div className="flex justify-center mt-4">
              <Button variant="link" onClick={() => router.push("/")}>
                Back to Login
              </Button>
            </div>
          </form>
        </Form>
      )}

      {isTokenValid === true && isResetComplete && (
        <div className="flex flex-col items-center gap-4 p-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <p className="text-center">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Button variant="link" onClick={() => router.push("/")}>
            Back to Login
          </Button>
        </div>
      )}
    </>
  )
}
