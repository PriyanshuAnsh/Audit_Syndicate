"use client";

import { useQuery } from "@tanstack/react-query";
import Nav from "../../components/nav";
import { api, clearTokens } from "../../lib/api";

export default function ProfilePage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => api("/me") });

  return (
    <div className="space-y-4">
      <Nav />
      <h1 className="text-2xl font-semibold">Profile</h1>
      {me.data && (
        <div className="rounded bg-white p-3">
          <p>Email: {me.data.email}</p>
          <p>Pet: {me.data.pet.name} ({me.data.pet.species})</p>
          <p>XP: {me.data.xp_total}</p>
        </div>
      )}
      <button className="rounded border border-ink px-3 py-2" onClick={() => { clearTokens(); window.location.href = "/"; }}>
        Logout
      </button>
    </div>
  );
}
