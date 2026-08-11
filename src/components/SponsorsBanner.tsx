interface SponsorsBannerProps {
  sponsors: {
    logoUrl: string;
    websiteUrl: string;
  }[];
}

export function SponsorsBanner({ sponsors }: SponsorsBannerProps) {
  return (
    <div className="mb-8 bg-[#0a1c4a] py-6">
      <div className="container mx-auto text-center">
        <h3 className="mb-6 text-4xl font-semibold text-white md:text-6xl">
          Thank you to our sponsors!
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-12">
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
                className="h-20 object-contain md:h-28"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
