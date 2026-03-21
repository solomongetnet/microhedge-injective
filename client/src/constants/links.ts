export const clientNavLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
  { name: "Location", href: "/location" },
];

import {
  LayoutDashboard,
  Users,
  User,
  ClipboardList,
  Settings,
  Book,
} from "lucide-react";
import { GiPoliceOfficerHead } from "react-icons/gi";

export const adminSidebarNavLinks = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard, // ✅ Dashboard layout icon is perfect
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users, // ✅ Good for multiple users
  },
  {
    title: "Characters",
    url: "/admin/characters",
    icon: User, // Better than Building; represents a single character
  },
  {
    title: "Plans",
    url: "/admin/plans",
    icon: Book, // Represents courses/offerings
  },
  {
    title: "User plans",
    url: "/admin/user-plans",
    icon: ClipboardList, // Shows a list of user plans
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: GiPoliceOfficerHead, // Represents reports/documents
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings, // ✅ Already appropriate
  },
];

const data = [
  {
    path: "/admin/dashboard",
    title: "Dashboard",
  },
  {
    path: "/admin/users",
    title: "Users",
  },
  {
    path: "/admin/departments",
    title: "Departments",
  },
  {
    path: "/admin/batchs",
    title: "Batchs",
  },
  {
    path: "/admin/sections",
    title: "Sections",
  },
  {
    path: "/admin/teachers",
    title: "Teachers",
  },
  {
    path: "/admin/results",
    title: "Results",
  },
  {
    path: "/admin/attendances",
    title: "Attendances",
  },
  {
    path: "/admin/courses",
    title: "Courses",
  },
  {
    path: "/admin/courses-offerings",
    title: "Courses Offerings",
  },
  {
    path: "/admin/my-courses",
    title: "My Courses",
  },
];
