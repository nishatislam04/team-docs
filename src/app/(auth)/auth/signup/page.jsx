import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
        <p className="text-muted-foreground">Get started with our platform</p>
      </div>
      <SignUpForm />
    </div>
  );
}
