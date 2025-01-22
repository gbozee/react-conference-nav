import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import VideoSection from "../components/VideoSection";
import ScheduleSection from "../components/ScheduleSection";
import SpeakerSection from "../components/SpeakerSection";
import TicketSection from "../components/TicketSection";
import SponsorsSection from "../components/SponsorsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AboutSection />
      <VideoSection />
      <SpeakerSection />
      <ScheduleSection />
      <TicketSection />
      <SponsorsSection />
    </div>
  );
};

export default Index;