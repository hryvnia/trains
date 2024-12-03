import { Layout } from "@/components";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
