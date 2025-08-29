import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import NewsContainer from '@/components/NewsContainer';
//import { Button } from '@/components/ui/button';
import UpcomingEventsContainer from '@/components/UpcomingEventsContainer';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 65;
  const images = [];
  for (let i = 1; i <= totalImages; i++) {
    images.push(`images/Rotating Archery Photos/${i}.jpg`);
  }

  const changeImage = () => {
    const newIndex = Math.floor(Math.random() * images.length);
    setCurrentImageIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      changeImage();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header id="hero-section" className="content-section active">
        <h1 className="text-balance text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          International <span className="text-primary">Combat Archery</span>{' '}
          Alliance
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-muted-foreground md:text-xl">
          Building a global alliance for the sport of Combat Archery.
        </p>
      </header>
      {/*
      <div className="mt-6 flex justify-center">
        <Button asChild size="lg" className="px-8 text-lg">
          <Link to="/registration">Join the Alliance</Link>
        </Button>
      </div>
      */}

      <div className="mt-8 grid grid-cols-1 pb-6 px-4 gap-4 lg:px-12 lg:grid-cols-2">
        <div className="image-rotator-container lg:col-span-2">
          <button id="prev-btn" className="rotator-btn" onClick={changeImage}>
            ❮
          </button>
          <img
            id="rotator-img"
            src={images[currentImageIndex]}
            alt="Rotating image of combat archery"
            className="rotator-img"
          />
          <button id="next-btn" className="rotator-btn" onClick={changeImage}>
            ❯
          </button>
        </div>

        <NewsContainer className="lg:justify-self-end lg:max-w-[500px]" />

        <UpcomingEventsContainer className="lg:max-w-[500px]" />
      </div>
    </>
  );
};

export default Home;
