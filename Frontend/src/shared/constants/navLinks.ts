import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  Image,
  FileText,
  Layers,
  UserCircle,
  Bell,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const adminNavLinks: NavLink[] = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Requests",
    to: "/admin/requests",
    icon: FileText,
  },
  {
    label: "Catalog",
    to: "/admin/catalog",
    icon: Layers,
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: Users,
  },
  {
    label: "Projects",
    to: "/admin/projects",
    icon: FolderOpen,
  },
  {
    label: "Analytics",
    to: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Settings,
  },
];

export const designerNavLinks: NavLink[] = [
  {
    label: "Dashboard",
    to: "/designer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Pending Assignments",
    to: "/designer/pending-assignments",
    icon: Bell,
  },
  {
    label: "Projects",
    to: "/designer/projects",
    icon: FolderOpen,
  },
  {
    label: "Mood Boards",
    to: "/designer/moodboards",
    icon: Image,
  },
  {
    label: "Quotations",
    to: "/designer/quotations",
    icon: FileText,
  },
  {
    label: "Clients",
    to: "/designer/clients",
    icon: UserCircle,
  },
];