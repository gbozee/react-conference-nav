import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import VideoSection from "../components/VideoSection";
import ScheduleSection from "../components/ScheduleSection";
import SpeakerSection from "../components/SpeakerSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AboutSection />
      <VideoSection />
      <SpeakerSection />
      <ScheduleSection />
    </div>
  );
};

export default Index;