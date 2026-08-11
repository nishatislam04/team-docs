import SignInForm from "./SignInForm";

export default async function SignInPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>
      <SignInForm />
    </div>
  );
}
