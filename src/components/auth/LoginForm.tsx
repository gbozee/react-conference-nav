'use client'
import { useState, useTransition } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Logo from '@/public/pycon2024.svg'
import Link from 'next/link'
import { login, signUp, sendOTP, verifySignUpOTP } from '@/lib/actions/auth'
import { useRouter, usePathname } from 'next/navigation'

type ValidationErrors = {
  email?: string;
  password?: string;
};

interface VerificationState {
  isVerifying: boolean;
  userId?: string | null;
  otp?: string;
}

export default function LoginForm({ isModal = false }: { isModal?: boolean }) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isPending, startTransition] = useTransition()
  const [verificationState, setVerificationState] = useState<VerificationState>({
    isVerifying: false,
    userId: null,
    otp: ''
  })
  const router = useRouter()
  const pathname = usePathname()
  
  const isSignupPage = pathname === '/signup'

  const validateForm = (formData: FormData): boolean => {
    const errors: ValidationErrors = {};
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResendOTP = async (email: string) => {
    startTransition(async () => {
      const result = await sendOTP(email);
      if (result.error) {
        setError(result.error);
      } else {
        setVerificationState({
          isVerifying: true,
          userId: result.userId
        });
      }
    });
  };
  
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setValidationErrors({});
    
    if (!validateForm(formData)) {
      return;
    }
    
    startTransition(async () => {
      if (isSignupPage) {
        const result = await signUp(formData);
        if (result.success) {
          setVerificationState({
            isVerifying: true,
            userId: result.userId
          });
        } else {
          if (result.existingUser) {
            router.push('/login');
          } else {
            setError(result.error);
          }
        }
      } else {
        const result = await login(formData);
        if (result.success) {
          router.push('/dashboard');
          router.refresh();
        } else {
          if (result.needsVerification) {
            const email = formData.get('email') as string;
            await handleResendOTP(email);
          } else {
            setError(result.error);
          }
        }
      }
    });
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verificationState.otp || !verificationState.userId) return;

    startTransition(async () => {
      const result = await verifySignUpOTP({
        userId: verificationState.userId,
        otp: verificationState.otp
      }, '/');

      if (!result?.success) {
        setError(result?.error || 'Verification failed. Please try again.');
      }
      // No need to handle success case as verifySignUpOTP will redirect on success
    });
  };

  if (verificationState.isVerifying) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src={Logo}
            alt="PyCon 2024 Logo"
            className="w-[120px] h-[40px] mb-6"
            priority
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to your email address. 
            Please enter the code below to verify your account.
          </p>

          <form onSubmit={handleVerifyOTP} className="w-full max-w-xs">
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter verification code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 text-center text-lg tracking-widest"
                  value={verificationState.otp}
                  onChange={(e) => setVerificationState(prev => ({ ...prev, otp: e.target.value }))}
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending || !verificationState.otp}
                className="w-full bg-[#003333] text-white py-2 rounded-md hover:bg-green-800 transition-colors font-bold disabled:opacity-50"
              >
                {isPending ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{' '}
              <button
                onClick={() => {
                  const email = document.querySelector<HTMLInputElement>('input[name="email"]')?.value;
                  if (email) handleResendOTP(email);
                }}
                className="text-green-600 hover:text-green-700 font-medium"
                disabled={isPending}
              >
                Resend code
              </button>
            </p>
          </div>

          {isPending && (
            <p className="text-sm text-gray-500 mt-4">
              Please wait while we verify your email...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl">
      <div className="flex flex-col items-center mb-8">
        <Image
          src={Logo}
          alt="PyCon 2024 Logo"
          className="w-[120px] h-[40px] mb-6"
          priority
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isSignupPage ? 'Create Account' : 'Welcome Back!'}
        </h1>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            className={`w-full px-3 py-2 border ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900`}
            required
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 border ${
                validationErrors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#003333] text-white py-2 rounded-md hover:bg-green-800 transition-colors font-bold disabled:opacity-50"
        >
          {isPending ? 'Loading...' : isSignupPage ? 'Create Account' : 'Sign In'}
        </button>

        <div className="text-center text-sm text-gray-500">
          Or
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/github-icon.svg"
              alt="GitHub"
              width={20}
              height={20}
            />
            Github
          </button>
        </div>

        <div className="text-center text-sm">
          {isSignupPage ? (
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign In
              </Link>
            </p>
          ) : (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign Up
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  )
} 