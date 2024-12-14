import { useState, useEffect, useRef } from "react";

const useLazyLoading = () => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(imageRef.current); // Unobserve after loading
        }
      },
      {
        rootMargin: "50px",
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.unobserve(imageRef?.current);
  }, []);

  return { isVisible, imageRef };
};

export default useLazyLoading;
