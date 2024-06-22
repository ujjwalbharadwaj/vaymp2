import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);  
  const backgroundImageUrls = ["./banner.jpeg", "./carouselcover222.jpg", "/caroselcover33.jpg"];
  // Function to handle next slide
    const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Function to handle next slide
  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % backgroundImageUrls.length;
    setCurrentSlide(nextIndex);
  };

  // Function to handle previous slide
  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + backgroundImageUrls.length) % backgroundImageUrls.length;
    setCurrentSlide(prevIndex);
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
   
  // Handle touch move
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
    // Function to handle previous slide
// Handle touch end
const handleTouchEnd = () => {
  if (touchStartX.current - touchEndX.current > 50) {
    nextSlide();
  } else if (touchEndX.current - touchStartX.current > 50) {
    prevSlide();
  }
  touchStartX.current = null;
  touchEndX.current = null;
};
    
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % backgroundImageUrls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
    className={`relative min-h-[20vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
          style={{
        backgroundImage: `url(${backgroundImageUrls[currentSlide]})`,
        backgroundSize: "cover", //contain
        backgroundPosition: "center top",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
       
      <div className={`${styles.section} w-[90%] 800px:w-[60%] p-5`}>
        <h1
          className={`text-[2.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] xl:text-[4rem] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          All your city stores <br /> at your fingertips
        </h1>
        <p className="pt-5 text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-[Poppins] font-[400] text-[#000000ba]">
          {/* Now shop from your city from the convenience of your home.Find the latest Phagwara collection and info about sales, experience hassle-free delivery, try the clothes from your home without worrying about returns. */}
        </p>
        <Link to="/products" className="inline-block">
          {/* <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">Shop Now</span>
          </div> */}
        </Link>
      </div>
      {/* dost for indicating current slide */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        {backgroundImageUrls.map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 mx-1 rounded-full cursor-pointer ${index === currentSlide ? 'bg-black' : 'bg-gray-300'}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;