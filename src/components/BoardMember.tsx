import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface BoardMemberProps {
  name: string;
  title: string;
  email: string;
  headshot: string;
  actionshot: string;
}

const BoardMember: React.FC<BoardMemberProps> = ({
  name,
  title,
  email,
  headshot,
  actionshot,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="board-member"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={isHovered ? actionshot : headshot}
        alt={`${name}'s headshot`}
        className="bio-photo"
      />
      <h3>{name}</h3>
      <p>{title}</p>
      <div className="flex items-center justify-center gap-2">
        <a href={`mailto:${email}`}>{email}</a>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          title="Copy email"
          type="button"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default BoardMember;
