import { useState, useEffect, useRef } from "react";

export function useElementIntersection(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elementInstance = elementRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (elementInstance) {
      observer.observe(elementInstance);
    }

    return () => {
      if (elementInstance) {
        observer.unobserve(elementInstance);
      }
    };
  }, [options]);

  return { elementRef, isIntersecting };
}
