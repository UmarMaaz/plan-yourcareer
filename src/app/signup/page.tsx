import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;

    const signUp = async (formData: FormData) => {
      'use server'
  
      const origin = (await headers()).get('origin')
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const firstName = formData.get('firstName') as string
      const lastName = formData.get('lastName') as string
      const supabase = await createClient()
  
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        },
      })
  
      if (error) {
        return redirect('/signup?message=Could not authenticate user')
      }

      // If user is returned (auto-confirm or already confirmed), create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
        })
      }
  
      return redirect('/login?message=Check email to continue sign in process')
    }
  
    return (
      <div className="flex min-h-screen bg-white">
        {/* Left Side - Hero/Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-purple-600 p-12 flex-col justify-between text-white relative overflow-hidden">
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
                <h1 className="text-5xl font-black leading-tight mb-6">
                  Build a job-winning resume in minutes.
                </h1>
                <p className="text-purple-100 text-xl font-medium leading-relaxed">
                  Join thousands of professionals who used Plan Your Career to land their dream jobs at top companies.
                </p>
              </div>
          </div>
  
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="bg-purple-500 p-3 rounded-2xl">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">Real-time Preview</p>
                <p className="text-purple-100 text-sm">See changes as you type with our instant editor.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="bg-emerald-500 p-3 rounded-2xl">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">ATS-Friendly</p>
                <p className="text-purple-100 text-sm">Templates designed to pass automated screening.</p>
              </div>
            </div>
          </div>
  
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-50" />
        </div>
  
        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-gray-50/50">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create your account</h2>
              <p className="text-gray-500 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-600 hover:underline font-bold">
                  Sign in
                </Link>
              </p>
            </div>
  
            <form action={signUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    className="h-12 px-4 rounded-xl border-gray-200 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    className="h-12 px-4 rounded-xl border-gray-200 bg-white"
                  />
                </div>
              </div>
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
                <Label htmlFor="password">Password</Label>
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
                Get Started for Free
              </Button>
            </form>

          {message && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-800">{message}</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-400">
              By signing up, you agree to our{' '}
              <Link href="#" className="underline">Terms of Service</Link> and{' '}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
