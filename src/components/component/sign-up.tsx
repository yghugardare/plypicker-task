"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";


export function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const {toast} = useToast()
  const router = useRouter();

  async function handleRegistration(e:FormEvent){
    e.preventDefault();
    setLoading(true);
    const userObj = {
      username,email,role,password,confirmPassword
    }
    try{
      const res = await fetch("/api/register",{
        method :'POST',
        headers : {
          'Content-Type' : 'application/json',

        },
        body : JSON.stringify(userObj)
      })
      const data = await res.json();
      // console.log(data)
      if(data?.success === true || res.ok){
        toast({
          title:"success",
          description:data?.message|| "User registered!"
        })
        router.push('/login')
      }else{
        toast({
          variant : "destructive",
          title : "Error",
          description : data?.message || "Something went wrong!"
        })
      }
    }catch(error:any){
      toast({
        variant : "destructive",
        description : error?.message || "Something went wrong!"
      })
    }finally{
      setLoading(false)
      setConfirmPassword("")
      setPassword("")
      setEmail("")
      setRole("")
      setUsername("")
      // console.log("Hi")
    }
  }
  return (
    <div className="flex min-h-[92vh] items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-4 rounded-lg bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">
            Create your account to get started.
          </p>
        </div>
        <form className="grid gap-4" onSubmit={e=>handleRegistration(e)}>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="text"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={value => setRole(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="team-member">Team Member</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className={`w-full !cursor-pointer ${loading && "!cursor-not-allowed"}`} disabled={loading} >
            {loading ? "Signing Up...":"Sign Up"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
