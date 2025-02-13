'use client'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import darkHeroBackground from '@/public/dark-hero-background.png'
import lightHeroBackground from '@/public/light-hero-background.png'

export default function HeroBackground({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={theme === 'dark' ? darkHeroBackground : lightHeroBackground}
          alt="Hero background"
          fill
          className="object-cover transition-all duration-300 ease-in-out"
          priority
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 