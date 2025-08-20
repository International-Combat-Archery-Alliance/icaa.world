import React, { useState } from 'react';

interface BoardMemberProps {
    name: string;
    title: string;
    email: string;
    headshot: string;
    actionshot: string;
}

const BoardMember: React.FC<BoardMemberProps> = ({ name, title, email, headshot, actionshot }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="board-member"
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}>
            <img src={isHovered ? actionshot : headshot} alt={`${name}'s headshot`} className="bio-photo" />
            <h3>{name}</h3>
            <p>{title}</p>
            <a href={`mailto:${email}`}>{email}</a>
        </div>
    );
};

export default BoardMember;
