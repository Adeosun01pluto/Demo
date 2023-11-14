import React, { useEffect, useRef, useState } from 'react';

export default function useInview() {
  const ref = useRef<HTMLDivElement>(null); // Specify the type of ref
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      setInView(entries[0].isIntersecting);
    });

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [ref]);

  return { ref, inView };
}
