"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Nav from "../../components/nav";
import { api } from "../../lib/api";

export default function ShopPage() {
  const qc = useQueryClient();
  const items = useQuery({ queryKey: ["shop"], queryFn: () => api("/shop/items") });
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: () => api("/inventory") });

  const purchase = useMutation({
    mutationFn: (itemId: number) => api("/shop/purchase", { method: "POST", body: JSON.stringify({ item_id: itemId }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const equip = useMutation({
    mutationFn: (itemId: number) => api("/pet/equip", { method: "POST", body: JSON.stringify({ item_id: itemId }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const owned = new Set((inventory.data || []).map((i: any) => i.item_id));

  return (
    <div className="space-y-4">
      <Nav />
      <h1 className="text-2xl font-semibold">Pet Shop</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {(items.data || []).map((item: any) => (
          <div key={item.id} className="rounded bg-white p-3 shadow">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm">{item.type} / {item.slot}</p>
            <p className="text-sm">{item.coin_cost} coins</p>
            {!owned.has(item.id) ? (
              <button className="mt-2 rounded bg-ink px-3 py-1 text-white" onClick={() => purchase.mutate(item.id)}>Buy</button>
            ) : (
              <button className="mt-2 rounded border border-ink px-3 py-1" onClick={() => equip.mutate(item.id)}>Equip</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
