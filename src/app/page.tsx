'use client'
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ScheduleSection from "@/components/ScheduleSection";
import SpeakerSection from "@/components/SpeakerSection";
import SponsorsSection from "@/components/SponsorsSection";
import TicketSection from "@/components/TicketSection";
import VenueSection from "@/components/VenueSection";
import VideoSection from "@/components/VideoSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
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
