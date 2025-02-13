'use client'
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ScheduleSection from "@/components/ScheduleSection";
import SpeakerSection from "@/components/SpeakerSection";
import SponsorsSection from "@/components/SponsorsSection";
import TicketSection from "@/components/TicketSection";
import VenueSection from "@/components/VenueSection";
import VideoSection from "@/components/VideoSection";
import HeroBackground from "@/components/HeroBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroBackground>
        <Navbar />
        <Hero />
      </HeroBackground>
      <AboutSection />
      <VideoSection />
      <SpeakerSection />
      <ScheduleSection />
      <TicketSection />
      <SponsorsSection />
      <CTASection />
      <VenueSection />
      <Footer />
    </div>
  );
}
