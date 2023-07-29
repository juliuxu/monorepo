import { useCallback, useEffect, useRef } from "react";

export const useShortcut = (keys: string, onTrigger: () => unknown) => {
  const pressedKeysRef = useRef("");
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    pressedKeysRef.current += event.key;
    if (pressedKeysRef.current === keys) {
      pressedKeysRef.current = "";
      onTrigger();
    } else if (!keys.startsWith(pressedKeysRef.current)) {
      // Reset when the combination is no longer matching
      pressedKeysRef.current = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};
