'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/actions/auth'
import Image from 'next/image'
import Logo from '@/public/pycon2024.svg'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')

  const handleSubmit = async (formData: FormData) => {
    if (!userId || !secret) {
      setError('Invalid reset password link')
      return
    }

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError(null)
    setSuccess(null)
    setIsPending(true)

    try {
      const result = await resetPassword(userId, secret, password)
      if (result.success) {
        setSuccess('Password has been reset successfully. You can now login with your new password.')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(result.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  if (!userId || !secret) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
            <p className="text-gray-600">
              This password reset link is invalid or has expired.
              Please request a new password reset link.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={Logo}
            alt="PyCon 2024 Logo"
            className="w-[120px] h-[40px] mb-6"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600 text-center">
            Please enter your new password
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm mt-2">{success}</p>
          )}
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#003333] text-white py-2 rounded-md hover:bg-green-800 transition-colors font-bold disabled:opacity-50"
          >
            {isPending ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
} 