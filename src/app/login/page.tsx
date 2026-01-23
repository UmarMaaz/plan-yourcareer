import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Zap, Shield, Sparkles, LogIn } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;

  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Hero/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Plan Your Career Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            Plan Your Career
          </Link>
          
          <div className="mt-20 max-w-md">
            <h1 className="text-5xl font-black leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Welcome back to your career hub.
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              Your dream job is just a few edits away. Log in to access your professional portfolio.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="bg-purple-600 p-3 rounded-2xl">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">Quick Resumes</p>
              <p className="text-slate-400 text-sm">Pick up exactly where you left off.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="bg-emerald-500 p-3 rounded-2xl">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">Private & Secure</p>
              <p className="text-slate-400 text-sm">Your professional data is encrypted.</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sign in</h2>
              <p className="text-gray-500 font-medium">
                New to Plan Your Career?{' '}
                <Link href="/signup" className="text-purple-600 hover:underline font-bold">
                  Create an account
                </Link>
              </p>
            </div>

          <form action={signIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 px-4 rounded-xl border-gray-200 bg-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-purple-600 hover:underline">Forgot password?</Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-12 px-4 rounded-xl border-gray-200 bg-white"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all active:scale-[0.98]">
              Sign In
            </Button>
          </form>

          {message && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-800">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
