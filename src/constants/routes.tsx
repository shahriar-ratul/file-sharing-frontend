/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NavItem } from "@/types";
import {
  ChevronDown,
  Container,
  FormInput,
  GanttChartSquare,
  Home,
  Layers3,
  Library,
  LineChart,
  ListMusic,
  MessageSquarePlus,
  Mic2,
  Music2,
  Navigation,
  Receipt,
  Shield,
  Table,
  User,
  Users,
  UsersRoundIcon,
} from "lucide-react";

export const mainRoutes: NavItem[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Home",
        path: "/home",
        icon: <Home size={16} />,
      },

      {
        title: "Users",
        path: "/users",

        icon: <Users size={16} />,
      },
      {
        title: "Files",
        path: "/files",
        icon: <Receipt size={16} />,
      },
    ],
    isLabel: true,
  },
];
