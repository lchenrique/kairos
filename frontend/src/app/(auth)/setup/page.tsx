import { redirect } from "next/navigation";

export default function SetupAliasPage() {
  redirect("/auth?mode=signup");
}
