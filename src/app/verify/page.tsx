'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyEmail } from '@/lib/actions/auth'
import Image from 'next/image'
import Logo from '@/public/pycon2024.svg'

export default function VerifyPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const secret = searchParams.get('secret')
    const userId = searchParams.get('userId')

    if (!secret || !userId) {
      setStatus('error')
      setError('Invalid verification link')
      return
    }

    verifyEmail(secret, userId).then((result) => {
      if (result.success) {
        setStatus('success')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setStatus('error')
        setError(result.error)
      }
    })
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-3xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src={Logo}
            alt="PyCon 2024 Logo"
            className="w-[120px] h-[40px] mb-6"
            priority
          />
          {status === 'verifying' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
              <p className="text-gray-600">
                Your email has been verified successfully. Redirecting you to login...
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 