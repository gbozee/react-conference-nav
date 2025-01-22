import { Button } from "./ui/button";

const CTASection = () => {
  return (
    <section className="relative py-24 md:py-32">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/510093d4-ddea-4a59-a0a5-642de0ad3dd2.png')`
        }}
      >
        <div className="absolute inset-0 bg-black/70" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-blue-400 text-sm uppercase tracking-wider mb-4 block">
            Lets talk
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Witness The Biggest Tech Event in 2022
          </h2>

          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg h-auto"
          >
            CONTACT US
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;