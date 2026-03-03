import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  links: SidebarLink[];
  header?: ReactNode;
  footer?: ReactNode;
}

const AppSidebar = ({ links, header, footer }: AppSidebarProps) => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-4rem)] border-r border-border bg-card/50 p-4">
      {header && <div className="mb-6">{header}</div>}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-lg glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      {footer && <div className="mt-4 pt-4 border-t border-border">{footer}</div>}
    </aside>
  );
};

export default AppSidebar;
