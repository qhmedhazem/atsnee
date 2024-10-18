"use client";

import { FC, HTMLAttributes, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";
import { MenuIcon, Settings, XIcon } from "lucide-react";
import Link from "@/components/ui/Link";
import Brand from "./Brand";

// Sidebar items
const userSettings = [
  { label: "Personal Settings", href: "/settings/personal" },
];

const adminSettings = [
  { label: "Announcements", href: "/admin/announcements" },
  { label: "Events", href: "/admin/events" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Users", href: "/admin/users" },
];

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SettingsLayout: FC<Props> = ({ ...props }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="max-h-screen flex flex-col">
      {/* Mobile Menu */}
      <div className="md:hidden bg-primary max-h-screen px-6 py-2">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <button className="text-white">
              <MenuIcon className="h-6 w-6" />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="p-4 bg-primary text-white">
            {/* Sidebar content */}
            <SidebarContent onClose={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar for larger screens */}
      <div className="flex flex-col md:flex-row max-h-full md:max-h-screen">
        <aside className="hidden md:block md:w-64 bg-primary text-white flex-shrink-0">
          <div className="p-6">
            <Brand withText={true} withDescription={false} />
            <SidebarContent onClose={() => setIsSidebarOpen(false)} />
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={cn(
            props.className,
            "flex-1 p-6 overflow-y-scroll overflow-x-hidden"
          )}
          {...props}
        />
      </div>
    </div>
  );
};

interface SidebarContentProps {
  onClose: () => void;
}

export const SidebarContent: FC<SidebarContentProps> = ({ onClose }) => (
  <div className="w-full mt-8 flex flex-col gap-8">
    {/* User Section */}
    <div>
      <h3 className="text-lg font-semibold">User</h3>
      <ul className="space-y-2 mt-2">
        {userSettings.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="block p-2 hover:bg-muted-foreground rounded-md"
              activeClass="bg-muted-foreground"
              onClick={onClose}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* Admin Section */}
    <div>
      <h3 className="text-lg font-semibold">Admininstration</h3>
      <ul className="space-y-2 mt-2">
        {adminSettings.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="block p-2 hover:bg-muted-foreground rounded-md"
              activeClass="bg-muted-foreground"
              onClick={onClose}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default SettingsLayout;
