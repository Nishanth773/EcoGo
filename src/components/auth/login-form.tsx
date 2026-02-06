'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

type FormState = {
  error: string | null;
};

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(async (prevState: FormState, formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      return { error: 'Email and password are required.' };
    }

    initiateEmailSignIn(auth, email, password);
    return { error: null };
  }, { error: null });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);


  // Effect to handle Firebase auth errors (e.g., wrong password)
  // This is a simplified example. In a real app, you'd listen for specific error codes.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && formRef.current) {
        // This is a proxy for a failed login attempt.
        // A more robust solution would involve checking auth error codes.
        // For this demo, we'll assume any state change back to null after trying is a failure.
        // @ts-ignore
        if (formRef.current.elements.email.value) {
            // A simple way to show an error without complex state management
            // In a real app, you would have a more robust error handling mechanism.
            console.log("Login failed");
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);


  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <form ref={formRef} action={formAction}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary font-headline">EcoGo</h1>
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {state?.error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="inline-block ml-auto text-sm underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <LoginButton />
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="#" className="underline text-accent-foreground hover:text-primary">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
