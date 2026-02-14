import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Onboarding</h1>
      <p>Your pet is created during signup. You received starter cash and coins.</p>
      <Link className="rounded bg-ink px-4 py-2 text-white" href="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
