'use client';
import React, { useState } from 'react';

import Loader from '@/components/loader/Loader';
import AppLogo from '@/components/logo/AppLogo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AlertCircle, Check } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthError } from "next-auth";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});
const LoginComponent = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username, password } = values;

    setLoading(true);

    try {
      await signIn("credentials", {
        username: username,
        password: password,
        redirect: true,
      })
        .then((res) => {
          console.log("res", res);
          if (res?.error) {
            setErrorMessage(res.error);
            setShowError(true);
          }

          if (res?.ok) {
            toast("Logged in successfully", {
              className: "bg-dark text-white",
              duration: 10000,
              position: "top-right",
              icon: <Check className="h-4 w-4" />,
              closeButton: true,
              style: {
                padding: "1rem",
                borderRadius: "0.5rem",
                backgroundColor: "green",
                color: "#fff",
              },
            });

            if (callbackUrl) {
              router.push(callbackUrl);
            } else {
              router.push(DEFAULT_LOGIN_REDIRECT);
            }
          }
        })
        .catch((error) => {
          console.log("error", error);
          setErrorMessage("Invalid username or password");
          setShowError(true);
        });
    } catch (error: unknown) {
      console.log("error", error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            setErrorMessage("Invalid username or password");
            setShowError(true);
            break;
          case "CallbackRouteError":
            setErrorMessage("An error occurred while logging in");
            setShowError(true);
            break;
          default:
            setErrorMessage("Error Signing in");
            setShowError(true);
            break;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <main className="flex flex-col items-center justify-center  p-24">
        <div className="flex flex-col space-y-2 justify-center min-h-fit ">
          <AppLogo />
          <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>
          <div className="">
            {showError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMessage ?? "Error Message"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-w-md w-full flex flex-col gap-4 mt-10"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email address"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
};

export default LoginComponent;
