import { useRef } from "react";

interface DevToolsTriggerProps {
  onTrigger: () => void;
}

/**
 * Trigger dev tools by clicking 5 times on the bottom right corner of the screen
 * Allows devtools to be opened on mobile
 */
export function DevToolsTrigger({ onTrigger }: DevToolsTriggerProps) {
  const clickRef = useRef({ clicks: 0, lastClicked: 0 });
  const onClick = () => {
    const now = Date.now();
    const { clicks, lastClicked } = clickRef.current;
    if (now - lastClicked > 500) {
      clickRef.current = { clicks: 1, lastClicked: now };
    } else {
      clickRef.current = { clicks: clicks + 1, lastClicked: now };
    }

    if (clickRef.current.clicks > 5) {
      clickRef.current = { clicks: 0, lastClicked: 0 };
      onTrigger();
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        lang="en"
        aria-label="Trigger dev tools"
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
