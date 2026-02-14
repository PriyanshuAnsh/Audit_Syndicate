"use client";

import { useQuery } from "@tanstack/react-query";
import Nav from "../../components/nav";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => api("/me") });
  const rewards = useQuery({ queryKey: ["rewards"], queryFn: () => api("/rewards/history") });

  return (
    <div className="space-y-4">
      <Nav />
      <p className="rounded-md bg-coral/20 p-2 text-sm">Simulated trading only. No real money is used.</p>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {me.data && (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded bg-white p-3 shadow">Cash: ${me.data.cash_balance.toFixed(2)}</div>
          <div className="rounded bg-white p-3 shadow">Coins: {me.data.coins_balance}</div>
          <div className="rounded bg-white p-3 shadow">Pet Level: {me.data.pet.level} ({me.data.pet.stage})</div>
        </div>
      )}
      <h2 className="text-lg font-medium">Recent rewards</h2>
      <ul className="space-y-2">
        {(rewards.data || []).slice(0, 5).map((event: any) => (
          <li className="rounded bg-white p-2" key={`${event.ref_id}-${event.created_at}`}>
            {event.source}: +{event.xp_delta} XP, +{event.coin_delta} coins
          </li>
        ))}
      </ul>
    </div>
  );
}
