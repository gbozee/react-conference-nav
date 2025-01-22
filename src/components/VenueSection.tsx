import { MapPin, Mail, Phone } from "lucide-react";

const VenueSection = () => {
  return (
    <section className="bg-navbar py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Event Details */}
          <div>
            <span className="block w-12 h-1 bg-blue-500 mb-4"></span>
            <span className="text-blue-400 text-sm uppercase tracking-wider mb-4 block">
              Event Detail
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Conference in the weekend!
            </h2>
            <p className="text-gray-400 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipisici elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
            <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded transition-colors">
              BUY TICKET
            </button>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-12">
            {/* Venue */}
            <div className="flex items-start gap-4">
              <MapPin className="text-blue-500 w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">Venue</h3>
                <p className="text-gray-400">
                  Garuda Wisnu Kencana Cultural Park, Jl. Raya Uluwatu, Bali Indonesia
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="text-blue-500 w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-400">Email: info@example.com</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-4">
              <Phone className="text-blue-500 w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">Contact</h3>
                <p className="text-gray-400">Phone: +1234 5678 910</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;