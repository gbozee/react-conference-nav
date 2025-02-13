'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Logo from '@/public/pycon2024.svg'
import Link from 'next/link'

export default function LoginForm({ isModal = false }: { isModal?: boolean }) {
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl">
      <div className="flex flex-col items-center mb-8">
        <Image
          src={Logo}
          alt="PyCon 2024 Logo"
          className="w-[120px] h-[40px] mb-6"
          priority
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
        </div>

        <button
          type="submit"
          className="w-full bg-[#003333] text-white py-2 rounded-md hover:bg-green-800 transition-colors font-bold"
        >
          Create Account
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
          {isModal ? (
            <p className="text-gray-600">
              Have an account?{' '}
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