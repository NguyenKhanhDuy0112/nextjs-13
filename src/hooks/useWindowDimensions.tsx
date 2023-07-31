import { useEffect, useState } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

const useWindowDimensions = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Function to update window dimensions
    const updateWindowDimensions = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener on mount
    window.addEventListener('resize', updateWindowDimensions);

    // Initial update
    updateWindowDimensions();

    // Remove event listener on unmount
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  return windowSize;
};

export default useWindowDimensions;
