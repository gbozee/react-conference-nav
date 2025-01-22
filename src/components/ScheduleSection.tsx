import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ScheduleItem {
  time: string;
  title: string;
  speaker: {
    name: string;
    role: string;
    image: string;
  };
}

const scheduleItems: ScheduleItem[] = [
  {
    time: "07.30 - 09.45",
    title: "Innovation & Technological",
    speaker: {
      name: "Adam Leno",
      role: "CEO UrbanTech",
      image: "/placeholder.svg"
    }
  },
  {
    time: "10.30 - 13.45",
    title: "Business Trend 2020",
    speaker: {
      name: "Anne Claire",
      role: "CEO IndoTech Ltd",
      image: "/placeholder.svg"
    }
  },
  {
    time: "14.30 - 16.45",
    title: "Managing Business",
    speaker: {
      name: "Garrett Ventura",
      role: "CEO Unicorn",
      image: "/placeholder.svg"
    }
  },
  {
    time: "17.30 - 18.45",
    title: "Cross Marketing Efficiency",
    speaker: {
      name: "Adam Leno",
      role: "CEO UrbanTech",
      image: "/placeholder.svg"
    }
  }
];

const ScheduleSection = () => {
  return (
    <section className="bg-[#0A0F1C] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-white text-sm mb-4">Schedule List</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Our Session Schedule</h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {scheduleItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#1A1F2C] rounded-lg p-6 flex flex-col md:flex-row items-center md:items-center gap-6"
            >
              <div className="bg-blue-500 text-white p-4 rounded-lg text-center min-w-[140px]">
                {item.time}
              </div>
              
              <h3 className="text-white text-xl flex-grow text-center md:text-left">
                {item.title}
              </h3>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.speaker.image} alt={item.speaker.name} />
                  <AvatarFallback>{item.speaker.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-white font-medium">{item.speaker.name}</p>
                  <p className="text-blue-400 text-sm">{item.speaker.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            SEE ALL SCHEDULE
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;