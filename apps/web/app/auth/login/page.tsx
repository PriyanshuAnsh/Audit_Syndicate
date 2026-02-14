"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, setTokens } from "../../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setTokens(data.access_token, data.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="mx-auto max-w-md space-y-3" onSubmit={submit}>
      <h1 className="text-2xl font-semibold">Login</h1>
      <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full rounded border p-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="rounded bg-ink px-4 py-2 text-white" type="submit">Login</button>
    </form>
  );
}
