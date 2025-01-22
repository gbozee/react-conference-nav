import { Button } from "./ui/button";

const AboutSection = () => {
  return (
    <section className="bg-[#1A1F2C] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-white/80 text-sm md:text-base">About The Event</h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Learn The Newest Strategy Of The Technology Industry
            </h2>
            <div className="w-20 h-1 bg-blue-500"></div>
          </div>
          
          <div className="space-y-6">
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            </p>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
            >
              LEARN MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;