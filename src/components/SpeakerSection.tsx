import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Speaker {
  name: string;
  role: string;
  image: string;
}

interface SpeakerSectionProps {
  className?: string;
  background?: string;
}

const speakers: Speaker[] = [
  {
    name: "Adam Leno",
    role: "CEO UrbanTech",
    image: "/lovable-uploads/deca7774-c2e4-41ee-99fe-e938764cd710.png"
  },
  {
    name: "Anne Claire",
    role: "CEO IndoTech Ltd",
    image: "/lovable-uploads/1698a39c-ef33-477f-ae74-b170f310f9f8.png"
  },
  {
    name: "Garrett Ventura",
    role: "CEO Unicorn",
    image: "/lovable-uploads/deca7774-c2e4-41ee-99fe-e938764cd710.png"
  }
];

const SpeakerSection = ({ background = "#0A0F1C", className = "" }: SpeakerSectionProps) => {
  return (
    <section 
      className={`py-16 md:py-24 ${className}`}
      style={{ backgroundColor: background }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-white/80 text-sm mb-4">Our Speakers</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Meet Keynotes Speakers
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => (
            <Card 
              key={index}
              className="bg-[#1A1F2C] border-none overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="p-0">
                <div className="aspect-square w-full overflow-hidden">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {speaker.name}
                  </h3>
                  <p className="text-blue-400 text-sm">
                    {speaker.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            SEE ALL SPEAKER
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpeakerSection;