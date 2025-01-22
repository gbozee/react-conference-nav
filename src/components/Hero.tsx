import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-screen pt-16"> {/* Added pt-16 for navbar height */}
      {/* Background with gradient overlay - replace backgroundImage with your custom image later */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-navbar via-blue-900 to-navbar bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center min-h-screen">
        <div className="max-w-3xl">
          <span className="text-white/90 mb-4 inline-block">Biggest Tech Event</span>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Growing The Global Technology Industry
          </h1>
          
          <p className="text-white/80 text-lg mb-8 max-w-2xl">
            But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 inline-block">
            <div className="text-2xl font-bold text-white mb-2">
              December 27, 2021
            </div>
            <div className="text-white/80">
              Garuda Wisnu Kencana Cultural Park, Jl. RayaUluwatu, Kuta,Badung, Bali Indonesia
            </div>
          </div>

          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg h-auto"
          >
            GET TICKET
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;