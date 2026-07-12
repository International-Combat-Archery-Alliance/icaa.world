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
        <h3 className="text-6xl font-semibold mb-4 text-white">
          Thank you to our sponsors!
        </h3>
        <div className="flex justify-center items-center flex-wrap gap-8 md:gap-8">
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
                className="h-16 md:h-24 object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
