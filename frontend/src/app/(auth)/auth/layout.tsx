import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticação | Kairos",
};

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
