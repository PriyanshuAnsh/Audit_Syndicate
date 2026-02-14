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
      <h1 className="text-2xl font-semibold">Paper Trading</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded bg-white p-3 shadow">
          <h2 className="mb-2 font-medium">Trade Ticket</h2>
          <input className="mb-2 w-full rounded border p-2" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="Symbol" />
          <input className="mb-2 w-full rounded border p-2" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" type="number" min="0.0001" step="0.0001" />
          <div className="flex gap-2">
            <button className="rounded bg-ink px-4 py-2 text-white" onClick={() => trade.mutate({ side: "buy" })}>Buy</button>
            <button className="rounded border border-ink px-4 py-2" onClick={() => trade.mutate({ side: "sell" })}>Sell</button>
          </div>
          {trade.error && <p className="mt-2 text-sm text-red-700">{(trade.error as Error).message}</p>}
        </div>
        <div className="rounded bg-white p-3 shadow">
          <h2 className="mb-2 font-medium">Quotes</h2>
          <ul className="max-h-80 space-y-1 overflow-auto text-sm">
            {(quotes.data || []).map((q: any) => (
              <li key={q.symbol} className="flex justify-between border-b py-1">
                <span>{q.symbol}</span><span>${q.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
