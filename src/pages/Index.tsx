import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import VideoSection from "../components/VideoSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4">
        <AboutSection />
        <VideoSection />
      </div>
    </div>
  );
};

export default Index;