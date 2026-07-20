interface SponsorsBannerProps {
  sponsors: {
    logoUrl: string;
    websiteUrl: string;
  }[];
}

export function SponsorsBanner({ sponsors }: SponsorsBannerProps) {
  return (
    <div className="bg-[#0a1c4a] py-6 mb-8">
      <div className="container mx-auto text-center">
        <h3 className="text-4xl md:text-6xl font-semibold mb-6 text-white">
          Thank you to our sponsors!
        </h3>
        <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4 md:gap-12">
          {sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img
                src={sponsor.logoUrl}
                alt={`Sponsor ${index + 1}`}
                className="h-20 md:h-28 object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
