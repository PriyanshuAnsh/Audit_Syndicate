import Link from "next/link";

export default function Landing() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">InvestiPet</h1>
      <p className="max-w-2xl text-lg">Learn investing safely through paper trading, lessons, and your evolving virtual pet.</p>
      <p className="rounded-md bg-coral/20 p-3 font-medium">Simulated trading only. No real money is used.</p>
      <div className="flex gap-3">
        <Link className="rounded bg-ink px-4 py-2 text-white" href="/auth/register">Get Started</Link>
        <Link className="rounded border border-ink px-4 py-2" href="/auth/login">Login</Link>
      </div>
    </div>
  );
}
