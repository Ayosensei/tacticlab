import Link from 'next/link'
import { signIn, signInWithGoogle } from '@/app/actions/auth'
import { SubmitButton } from '@/components/SubmitButton'

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground hover:bg-foreground/10 flex items-center group text-[11px] font-black uppercase tracking-widest transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form
        className="animate-fade-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground"
        action={signIn}
      >
        <h1 className="text-2xl font-black mb-2 text-emerald-500 uppercase tracking-widest text-center">Log In</h1>

        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-3 bg-card border border-border mb-2 focus:border-emerald-500/50 focus:bg-foreground/5 outline-none transition-all text-sm font-medium"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-2" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-3 bg-card border border-border mb-6 focus:border-emerald-500/50 focus:bg-foreground/5 outline-none transition-all text-sm font-medium"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <SubmitButton
          className="bg-emerald-500 rounded-md px-4 py-3 text-emerald-950 mb-2 font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        
        {searchParams?.error && (
          <p className="mt-4 p-4 bg-red-500/10 text-red-400 text-center rounded-lg border border-red-500/20 text-[11px] font-bold uppercase tracking-wide">
            {searchParams.error}
          </p>
        )}
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-emerald-500/10 text-emerald-400 text-center rounded-lg border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wide">
            {searchParams.message}
          </p>
        )}
        
        <div className="flex flex-col gap-2 mt-2 text-center text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
           Don&apos;t have an account?
           <Link href="/register" className="font-black text-foreground hover:text-emerald-400 underline transition-colors">
             Register
           </Link>
        </div>
      </form>

      <div className="relative flex items-center py-5">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink-0 mx-4 text-muted-foreground text-[10px] font-black uppercase tracking-widest">Or</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      <form action={signInWithGoogle} className="w-full">
        <button className="w-full bg-card border border-border hover:border-foreground/20 rounded-md px-4 py-3 text-foreground mb-2 flex items-center justify-center gap-3 transition-colors text-[11px] font-black uppercase tracking-widest shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18">
             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             <path d="M1 1h22v22H1z" fill="none"/>
           </svg>
           Continue with Google
        </button>
      </form>

    </div>
  )
}
