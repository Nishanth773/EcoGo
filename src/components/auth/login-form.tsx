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
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, initiateEmailSignIn } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.83 0-6.94-2.97-6.94-6.94s3.11-6.94 6.94-6.94c2.21 0 3.64.88 4.5 1.72l2.5-2.5C18.66 3.12 15.98 2 12.48 2 7.18 2 3 6.18 3 11.48s4.18 9.48 9.48 9.48c2.92 0 5.17-1 6.84-2.63 1.72-1.67 2.36-4.02 2.36-6.18 0-.82-.07-1.42-.18-1.84H12.48z" />
    </svg>
  );
}


type FormState = {
  error: string | null;
};

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [googleError, setGoogleError] = useState<string | null>(null);

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
  
  const handleGoogleSignIn = () => {
    setGoogleError(null);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .catch((error) => {
        if (error.code === 'auth/operation-not-allowed') {
          setGoogleError("Google Sign-In is not enabled. Please enable it in your Firebase project's console.");
        } else {
          console.error("Google Sign-In Error:", error);
          setGoogleError(error.message || "An unknown error occurred during Google Sign-In.");
        }
      });
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <form action={formAction}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary font-headline">EcoGo</h1>
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {(state?.error || googleError) && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{state?.error || googleError}</AlertDescription>
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
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
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
