'use client'
import { useState, useTransition, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Logo from '@/public/pycon2024.svg'
import Link from 'next/link'
import { login, signUp, sendOTP, verifySignUpOTP, sendPasswordRecovery, loginWithPassword, type AuthResult } from '@/lib/actions/auth'
import { useRouter, usePathname } from 'next/navigation'

type ValidationErrors = {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
};

interface VerificationState {
  isVerifying: boolean;
  userId: string | undefined;
  email: string;
  otp: string;
}

interface FormState {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export default function LoginForm({ 
  isModal = false, 
  nextUrl = "/",
  onSuccess
}: { 
  isModal?: boolean, 
  nextUrl?: string,
  onSuccess?: () => void 
}) {
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isPending, startTransition] = useTransition()
  const [verificationState, setVerificationState] = useState<VerificationState>({
    isVerifying: false,
    userId: undefined,
    email: '',
    otp: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [otpTimer, setOtpTimer] = useState<number>(0)
  const [canResendOTP, setCanResendOTP] = useState<boolean>(true)
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  const [formState, setFormState] = useState<FormState>({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  })
  
  const router = useRouter()
  const pathname = usePathname()
  
  const isSignupPage = pathname === '/signup'

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOTP(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpTimer]);

  const validateForm = (formData: FormData): boolean => {
    const errors: ValidationErrors = {};

    if (!verificationState.isVerifying) {
      if (!formState.email) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
        errors.email = 'Please enter a valid email address';
      }

      if (isSignupPage) {
        if (!formState.name) {
          errors.name = 'Name is required';
        }
        if (!formState.password) {
          errors.password = 'Password is required';
        } else if (formState.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
        if (!formState.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (formState.confirmPassword !== formState.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
      } else if (loginMethod === 'password') {
        if (!formState.password) {
          errors.password = 'Password is required';
        }
      }
    } else {
      if (!verificationState.otp) {
        errors.otp = 'Verification code is required';
      } else if (!/^\d{6}$/.test(verificationState.otp)) {
        errors.otp = 'Please enter a valid 6-digit code';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResendOTP = async () => {
    if (!canResendOTP || otpTimer > 0) return;
    
    startTransition(async () => {
      const result = await sendOTP(verificationState.email);
      if (result.error) {
        setError(result.error);
      } else if (result.userId) {
        setVerificationState(prev => ({
          ...prev,
          userId: result.userId || undefined
        }));
        setOtpTimer(60);
        setCanResendOTP(false);
        setError(null);
      }
    });
  };

  const handleChangeEmail = () => {
    setVerificationState({
      isVerifying: false,
      userId: undefined,
      email: '',
      otp: ''
    });
    setOtpTimer(0);
    setCanResendOTP(true);
    setError(null);
  };

  const handleForgotPassword = async (email: string) => {
    startTransition(async () => {
      try {
        const result = await sendPasswordRecovery(email);
        if (result.success) {
          setError('Password recovery email sent. Please check your inbox.');
        } else {
          setError(result.error || 'Failed to send recovery email.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
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
      try {
        if (verificationState.isVerifying) {
          // Handle OTP verification
          const result = await verifySignUpOTP({
            userId: verificationState.userId!,
            otp: verificationState.otp
          }, nextUrl);

          if (!result?.success) {
            setError(result?.error || 'Verification failed. Please try again.');
          } else {
            // First refresh the router to update auth state
            router.refresh();
            
            // Then handle modal close or redirect
            if (onSuccess) {
              onSuccess();
            } else if (result.redirect) {
              router.push(result.redirect);
            }
          }
        } else {
          // Create a new FormData instance with current form state
          const formDataToSubmit = new FormData();
          formDataToSubmit.append('email', formState.email);
          if (isSignupPage) {
            formDataToSubmit.append('name', formState.name);
            formDataToSubmit.append('password', formState.password);
          } else if (loginMethod === 'password') {
            formDataToSubmit.append('password', formState.password);
          }

          // Handle initial login/signup
          const action = isSignupPage ? signUp : (loginMethod === 'password' ? loginWithPassword : login);
          const result = await action(formDataToSubmit);
          
          if (result.success) {
            if (loginMethod === 'password' && !isSignupPage) {
              // Password login successful, refresh and redirect
              router.refresh();
              if (onSuccess) {
                onSuccess();
              } else if (result.redirect) {
                router.push(result.redirect);
              }
            } else {
              // OTP flow
              setVerificationState({
                isVerifying: true,
                userId: result.userId!,
                email: result.email || formState.email,
                otp: ''
              });
              setOtpTimer(60);
              setCanResendOTP(false);
              if (result.message) {
                setError(null);
              }
            }
          } else {
            setError(result.error || 'An error occurred. Please try again.');
          }
        }
      } catch (err) {
        console.log(err)
        setError('An unexpected error occurred. Please try again.');
      }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a login code to {verificationState.email}
          </p>

          <form action={handleSubmit} className="w-full max-w-xs">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Login Code
                  </label>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Change email
                  </button>
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 text-center text-lg tracking-widest"
                  value={verificationState.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setVerificationState(prev => ({ ...prev, otp: value }));
                  }}
                  pattern="\d{6}"
                  maxLength={6}
                  required
                />
                {validationErrors.otp && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.otp}</p>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending || !verificationState.otp}
                className="w-full bg-[#003333] text-white py-2 rounded-md hover:bg-green-800 transition-colors font-bold disabled:opacity-50"
              >
                {isPending ? 'Verifying...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{' '}
              {otpTimer > 0 ? (
                <span className="text-gray-400">
                  Resend available in {otpTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResendOTP || isPending}
                  className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </p>
          </div>
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
        <p className="text-gray-600 text-center">
          {isSignupPage 
            ? 'Enter your details to create an account'
            : 'Sign in to your account'}
        </p>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      <form action={handleSubmit} className="space-y-6">
        {isSignupPage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={formState.name}
              onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900`}
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formState.email}
            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-3 py-2 border ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900`}
            required
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>

        {(isSignupPage || (!isSignupPage && loginMethod === 'password')) && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {!isSignupPage && (
                <button
                  type="button"
                  onClick={() => {
                    if (formState.email) {
                      handleForgotPassword(formState.email);
                    } else {
                      setError('Please enter your email address first');
                    }
                  }}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formState.password}
                onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full px-3 py-2 border ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>
        )}

        {isSignupPage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formState.confirmPassword}
                onChange={(e) => setFormState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`w-full px-3 py-2 border ${
                  validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 pr-10`}
                required
              />
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>
        )}

        {!isSignupPage && loginMethod === 'password' && (
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
              className="text-sm text-green-600 hover:text-green-700"
            >
              {loginMethod === 'password' ? 'Use one-time code' : 'Use password'}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#003333] text-white py-2 rounded-md hover:bg-green-800 transition-colors font-bold disabled:opacity-50"
        >
          {isPending ? 'Please wait...' : (isSignupPage ? 'Create Account' : (loginMethod === 'password' ? 'Sign In' : 'Continue with Email'))}
        </button>

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
  );
} 