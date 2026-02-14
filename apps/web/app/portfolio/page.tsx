"use client";

import { useQuery } from "@tanstack/react-query";
import Nav from "../../components/nav";
import { api } from "../../lib/api";

export default function PortfolioPage() {
  const portfolio = useQuery({ queryKey: ["portfolio"], queryFn: () => api("/portfolio") });

  return (
    <div className="space-y-4">
      <Nav />
      <h1 className="text-2xl font-semibold">Portfolio</h1>
      {portfolio.data && (
        <>
          <div className="grid gap-2 md:grid-cols-4">
            <div className="rounded bg-white p-3">Cash ${portfolio.data.cash.toFixed(2)}</div>
            <div className="rounded bg-white p-3">Total ${portfolio.data.total_value.toFixed(2)}</div>
            <div className="rounded bg-white p-3">P/L ${portfolio.data.total_pl.toFixed(2)}</div>
            <div className="rounded bg-white p-3">Diversification {portfolio.data.diversification_score}%</div>
          </div>
          <table className="w-full rounded bg-white text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Symbol</th><th className="p-2">Qty</th><th className="p-2">Avg Cost</th><th className="p-2">Price</th><th className="p-2">Value</th><th className="p-2">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.data.positions.map((p: any) => (
                <tr key={p.symbol} className="border-t">
                  <td className="p-2">{p.symbol}</td>
                  <td className="p-2">{p.quantity}</td>
                  <td className="p-2">${p.avg_cost.toFixed(2)}</td>
                  <td className="p-2">${p.market_price.toFixed(2)}</td>
                  <td className="p-2">${p.market_value.toFixed(2)}</td>
                  <td className="p-2">{p.allocation_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
