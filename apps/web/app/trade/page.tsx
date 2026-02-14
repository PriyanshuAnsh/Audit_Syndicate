"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Nav from "../../components/nav";
import { api } from "../../lib/api";

export default function TradePage() {
  const qc = useQueryClient();
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api("/market/quotes") });
  const [symbol, setSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState("1");

  const trade = useMutation({
    mutationFn: ({ side }: { side: "buy" | "sell" }) =>
      api(`/trades/${side}`, {
        method: "POST",
        body: JSON.stringify({ symbol, quantity: Number(quantity) }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quotes"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return (
    <div className="space-y-4">
      <Nav />
      <div className="glass p-5">
        <h1 className="page-title">Paper Trading</h1>
        <p className="page-subtitle">Practice safe entries and exits with simulated quotes.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass p-4">
          <h2 className="mb-3 text-lg font-semibold">Trade Ticket</h2>
          <input className="input mb-2" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="Symbol" />
          <input className="input mb-3" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" type="number" min="0.0001" step="0.0001" />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => trade.mutate({ side: "buy" })}>Buy</button>
            <button className="btn-secondary" onClick={() => trade.mutate({ side: "sell" })}>Sell</button>
          </div>
          {trade.error && <p className="mt-2 text-sm text-red-700">{(trade.error as Error).message}</p>}
        </div>
        <div className="glass p-4">
          <h2 className="mb-3 text-lg font-semibold">Live Simulated Quotes</h2>
          <ul className="max-h-[420px] space-y-1 overflow-auto pr-1 text-sm">
            {(quotes.data || []).map((q: any) => (
              <li key={q.symbol} className="flex justify-between rounded-lg bg-white/75 px-3 py-2">
                <span className="font-semibold">{q.symbol}</span><span>${q.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
