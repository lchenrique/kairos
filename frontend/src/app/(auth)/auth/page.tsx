import { AuthFlow } from "../_components/auth-flow";

type AuthPageProps = {
  searchParams?: {
    mode?: string;
  };
};

export default function AuthPage({ searchParams }: AuthPageProps) {
  const initialMode = searchParams?.mode === "login" ? "login" : "signup";

  return <AuthFlow initialMode={initialMode} />;
}
