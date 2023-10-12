import { useId } from "react";

// Test comment
interface DevBoxProps {
  children: React.ReactNode;
}
export function DevBox({ children }: DevBoxProps) {
  const id = useId().replaceAll(":", "");
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
    .dev-box-${id} {
      position: fixed;

      right: 0;
      bottom: 0;
      border-top-left-radius: 0.5rem;

      padding: 12px 16px;

      font-size: 26px;
      line-height: 1.3;

      font-smoothing: antialiased;
      -webkit-font-smoothing: antialiased;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);

      color: rgb(188, 59, 227);
      background-color: rgba(188, 59, 227, 0.2);
      border-color: rgb(188, 59, 227);
    }

    @media (min-width: 1024px) {
      .dev-box-${id} {
        font-size: 2.5vw;
      }
    }
    `,
        }}
      />
      <div className={`dev-box-${id}`}>{children}</div>
    </>
  );
}
