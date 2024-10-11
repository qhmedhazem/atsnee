import { FC, HTMLAttributes, ReactNode } from "react";
import Link, { LinkProps } from "./ui/Link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode[];
}

const Tabs: FC<Props> = ({ children }) => {
  return (
    <ul
      className="bg-gray-300 grid justify-items-center items-center rounded-md gap-2 py-1 px-1
      grid-flow-col-dense"
      style={{
        display: "grid",
        gridAutoColumns: "1fr",
        gridAutoRows: "1fr",
      }}
    >
      {children}
    </ul>
  );
};

interface TabProps extends LinkProps {}

export const Tab: FC<TabProps> = ({
  href,
  className,
  activeClass,
  children,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-grow justify-center items-center w-full h-full px-3 py-1.5 rounded-sm",
        className
      )}
      activeClass={cn("bg-white", activeClass)}
    >
      {children}
    </Link>
  );
};

export default Tabs;
