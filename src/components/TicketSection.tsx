import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface TicketFeature {
  name: string;
  included: boolean;
}

interface TicketTier {
  name: string;
  price: number;
  description: string;
  features: TicketFeature[];
}

const tickets: TicketTier[] = [
  {
    name: "Silver",
    price: 150,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    features: [
      { name: "6 Bouquets per Month", included: true },
      { name: "Free Delivery", included: true },
      { name: "Workshops and Engage", included: true },
      { name: "Conference Access", included: false },
      { name: "Access to exhibition floor", included: false },
    ],
  },
  {
    name: "Gold",
    price: 250,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    features: [
      { name: "6 Bouquets per Month", included: true },
      { name: "Free Delivery", included: true },
      { name: "Workshops and Engage", included: true },
      { name: "Conference Access", included: true },
      { name: "Access to exhibition floor", included: true },
    ],
  },
  {
    name: "Platinum",
    price: 400,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    features: [
      { name: "6 Bouquets per Month", included: true },
      { name: "Free Delivery", included: true },
      { name: "Workshops and Engage", included: true },
      { name: "Conference Access", included: true },
      { name: "Access to exhibition floor", included: true },
    ],
  },
];

const TicketSection = () => {
  return (
    <section className="bg-[#0A0F1C] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-white/80 text-sm mb-2">Pricing Package</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Get Your Ticket Now
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tickets.map((ticket, index) => (
            <Card
              key={index}
              className="bg-[#1A1F2C] border-none text-white hover:transform hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold mb-2">{ticket.name}</h3>
                <div className="text-4xl font-bold mb-4">
                  <span className="text-white">${ticket.price}</span>
                </div>
                <p className="text-white/80 text-sm mb-6">{ticket.description}</p>
                <div className="w-16 h-1 bg-blue-500 mb-6"></div>
                <ul className="space-y-4 mb-8">
                  {ticket.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check
                        className={`h-5 w-5 ${
                          feature.included ? "text-blue-500" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={feature.included ? "text-white" : "text-gray-600"}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  GET TICKET
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TicketSection;