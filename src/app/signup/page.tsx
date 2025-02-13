import LoginForm from '@/components/auth/LoginForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm mode="signup" />
    </div>
  )
} 