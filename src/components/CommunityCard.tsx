import { cn } from '@/lib/utils';
import { useScrollSafeHover } from '@/hooks/useScrollSafeHover';
import { communities, type Community } from './ArcheryMap';

interface CommunityLink {
  label: string;
  href: string;
}

interface CommunityCardProps {
  id?: string;
  name: string;
  logoUrl: string;
  logoAlt: string;
  logoClassName?: string;
  city: string;
  links?: CommunityLink[];
  isActive?: boolean;
  onHover: (community: Community | null) => void;
}

function CommunityCard({
  id,
  name,
  logoUrl,
  logoAlt,
  logoClassName,
  city,
  links,
  isActive = false,
  onHover,
}: CommunityCardProps) {
  const community = communities.find((c) => c.name === name);
  if (!community) return null;

  const cardHover = useScrollSafeHover(() => onHover(null));

  const handleEnter = () => {
    cardHover.handleEnter();
    onHover(community);
  };

  const cardClassName = cn(
    'flex flex-col min-h-[290px] rounded-lg bg-[var(--light-gray)] p-6 text-center text-[var(--navy-blue)] shadow-md hover:-translate-y-[5px] hover:shadow-lg scroll-mt-[472px] md:scroll-mt-[416px]',
    isActive && 'ring-2 ring-primary',
  );

  const content = (
    <>
      <div className="mb-4 flex h-24 items-center justify-center">
        <img
          src={logoUrl}
          alt={logoAlt}
          className={cn(
            'max-h-full max-w-[100px] h-auto w-auto',
            logoClassName,
          )}
        />
      </div>
      <h3 className="mb-1 text-[var(--navy-blue)]">{community.name}</h3>
      <p>{city}</p>
    </>
  );

  if (links && links.length > 0) {
    return (
      <div
        id={id}
        data-community={community.name}
        className={cardClassName}
        onMouseEnter={handleEnter}
        onMouseLeave={cardHover.handleLeave}
      >
        <a
          href={community.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          {content}
        </a>
        <div className="mt-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-[0.9rem] text-primary underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <a
      id={id}
      data-community={community.name}
      href={community.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
      onMouseEnter={handleEnter}
      onMouseLeave={cardHover.handleLeave}
    >
      {content}
    </a>
  );
}

export { CommunityCard };
