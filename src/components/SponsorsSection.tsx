const SponsorsSection = () => {
  const sponsors = [
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
    "/lovable-uploads/964e1443-1b15-4182-b107-ef5236467c10.png",
  ];

  return (
    <section className="bg-[#0A0F1C] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            The Sponsors
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
          {sponsors.map((sponsor, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4"
            >
              <img
                src={sponsor}
                alt={`Sponsor ${index + 1}`}
                className="w-full h-auto max-w-[160px] opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;