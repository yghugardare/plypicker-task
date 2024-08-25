"use client";

import { FormEvent, JSX, SVGProps, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if(data.success || res.ok){
        localStorage.setItem('token', data.token);
        toast({
          title: "Success",
          description: "User log in successfull!",
        });
        router.push("/")
      }else{
        toast({
          variant : "destructive",
          title : "Error",
          description : data?.message || "Something went wrong!"
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error?.message || "Something went wrong!",
      });
    }

    setPassword("");
    setEmail("");
    
  }
  return (
    <div className="flex min-h-[92] mt-36 items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-4 rounded-lg bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Enter your email and password to sign in.
          </p>
        </div>
        <form className="grid gap-4" onSubmit={(e) => handleLogin(e)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-1 right-1 h-7 w-7"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <SlashEyeIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              {/* {showPassword ? "hide" : "show"} */}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SlashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2 2 22" />
    </svg>
  );
}

function SlashEyeIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      fill="#ffffff"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M 3.71875 2.28125 L 2.28125 3.71875 L 8.5 9.90625 L 19.59375 21 L 21.5 22.9375 L 28.28125 29.71875 L 29.71875 28.28125 L 23.5 22.0625 C 27.734375 19.964844 30.574219 16.851563 30.75 16.65625 L 31.34375 16 L 30.75 15.34375 C 30.480469 15.042969 24.085938 8 16 8 C 14.042969 8 12.195313 8.429688 10.5 9.0625 Z M 16 10 C 18.152344 10 20.1875 10.605469 22 11.4375 C 22.644531 12.515625 23 13.734375 23 15 C 23 16.816406 22.296875 18.476563 21.15625 19.71875 L 18.3125 16.875 C 18.730469 16.363281 19 15.714844 19 15 C 19 13.34375 17.65625 12 16 12 C 15.285156 12 14.636719 12.269531 14.125 12.6875 L 12.09375 10.65625 C 13.335938 10.273438 14.636719 10 16 10 Z M 6.6875 10.90625 C 3.480469 12.878906 1.398438 15.175781 1.25 15.34375 L 0.65625 16 L 1.25 16.65625 C 1.507813 16.945313 7.429688 23.425781 15.0625 23.9375 C 15.371094 23.96875 15.683594 24 16 24 C 16.316406 24 16.628906 23.96875 16.9375 23.9375 C 17.761719 23.882813 18.566406 23.773438 19.34375 23.59375 L 17.5625 21.8125 C 17.054688 21.929688 16.539063 22 16 22 C 12.140625 22 9 18.859375 9 15 C 9 14.46875 9.070313 13.949219 9.1875 13.4375 Z M 7.25 12.9375 C 7.089844 13.613281 7 14.300781 7 15 C 7 16.738281 7.488281 18.339844 8.34375 19.71875 C 6.054688 18.40625 4.304688 16.867188 3.40625 16 C 4.152344 15.277344 5.496094 14.078125 7.25 12.9375 Z M 24.75 12.9375 C 26.503906 14.078125 27.84375 15.277344 28.59375 16 C 27.695313 16.867188 25.917969 18.4375 23.625 19.75 C 24.484375 18.371094 25 16.738281 25 15 C 25 14.300781 24.910156 13.609375 24.75 12.9375 Z"></path>
      </g>
    </svg>
  );
}
