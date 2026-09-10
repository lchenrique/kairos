import { redirect } from "next/navigation";

export default function CadastroAliasPage() {
  redirect("/auth?mode=signup");
}
