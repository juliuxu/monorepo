import { NavLink } from "@remix-run/react";

interface PermalinkHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as: "h1" | "h2" | "h3";
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const PermalinkHeading = ({
  as: Component,
  children,
  className,
  id,
  ...rest
}: PermalinkHeadingProps) => {
  return (
    <Component className={`${className}`} id={id} {...rest}>
      <NavLink to={id} prefetch="viewport">
        {children}
      </NavLink>
    </Component>
  );
};
