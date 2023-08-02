import { useRef } from "react";

interface InvisibleBoxTrigger {
  requiredClicks: number;
  onTrigger: () => void;
}

/**
 * Trigger something by clicking n times on the bottom right corner of the screen
 * Allows dev mode to be opened on mobile
 */
export function InvisibleBoxTrigger({
  requiredClicks: clickCount,
  onTrigger,
}: InvisibleBoxTrigger) {
  const clickRef = useRef({ clicks: 0, lastClicked: 0 });
  const onClick = () => {
    const now = Date.now();
    const { clicks, lastClicked } = clickRef.current;
    if (now - lastClicked > 500) {
      clickRef.current = { clicks: 1, lastClicked: now };
    } else {
      clickRef.current = { clicks: clicks + 1, lastClicked: now };
    }

    if (clickRef.current.clicks >= clickCount) {
      clickRef.current = { clicks: 0, lastClicked: 0 };
      onTrigger();
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        lang="en"
        // TODO: Label as prop
        aria-label="Trigger dev mode"
        onClick={onClick}
        style={{
          height: 64,
          width: 64,
          position: "absolute",
          bottom: 0,
          right: 0,
          opacity: 0,
        }}
      />
    </div>
  );
}
