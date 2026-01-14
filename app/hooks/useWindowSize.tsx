import { useCallback, useEffect, useState } from "react";

const useWindowSize = () => {
  const isBrowser = (): boolean => typeof window !== "undefined";

  const getSize = useCallback(() => {
    if (!isBrowser()) return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
  }, []);

  const [size, setSize] = useState(getSize);

  useEffect(() => {
    if (!isBrowser()) return;
    const onResize = () => setSize(getSize());
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [getSize]);

  return {
    ...size,
    isMobile: size.width < 640,
    isSmallTablet: size.width >= 640 && size.width < 768,
    isTablet: size.width >= 768 && size.width < 1024,
    isDesktop: size.width >= 1024,
    isLargeDesktop: size.width >= 1280,
  };
};

export default useWindowSize;
