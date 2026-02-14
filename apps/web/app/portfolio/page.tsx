"use client";

import { useQuery } from "@tanstack/react-query";
import Nav from "../../components/nav";
import { api } from "../../lib/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Position = {
  symbol: string;
  quantity: number;
  avg_cost: number;
  market_price: number;
  market_value: number;
  unrealized_pl: number;
  allocation_pct: number;
};

type PortfolioResponse = {
  cash: number;
  total_value: number;
  total_pl: number;
  diversification_score: number;
  positions: Position[];
};

const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const formatSignedMoney = (n: number) =>
  `${n >= 0 ? "+" : "-"}${formatMoney(Math.abs(n))}`;

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#a855f7",
];

export default function PortfolioPage() {
  const portfolio = useQuery<PortfolioResponse>({
    queryKey: ["portfolio"],
    queryFn: () => api("/portfolio"),
  });

  if (portfolio.isLoading) {
    return (
      <div className="space-y-4">
        <Nav />
        <div className="glass p-6 text-center text-slate-500">
          Loading portfolio...
        </div>
      </div>
    );
  }

  if (portfolio.isError || !portfolio.data) {
    return (
      <div className="space-y-4">
        <Nav />
        <div className="glass p-6 text-center text-red-500">
          Failed to load portfolio.
        </div>
      </div>
    );
  }

  const data = portfolio.data;

  const chartData = data.positions.map((p) => ({
    name: p.symbol,
    value: p.market_value,
  }));

  return (
    <div className="space-y-6">
      <Nav />

      {/* Header */}
      <div className="glass p-6">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-slate-500">
          Monitor value, allocation mix, and diversification health.
        </p>
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPI title="Cash" value={formatMoney(data.cash)} />
        <KPI title="Total Value" value={formatMoney(data.total_value)} />
        <KPI
          title="Unrealized P/L"
          value={formatSignedMoney(data.total_pl)}
          positive={data.total_pl >= 0}
        />
        <KPI
          title="Diversification"
          value={`${data.diversification_score}%`}
        />
      </div>

      {/* Charts */}
      {data.positions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie */}
          <div className="glass p-5">
            <h2 className="font-semibold mb-4">Asset Allocation</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      formatMoney(Number(value ?? 0))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar */}
          <div className="glass p-5">
            <h2 className="font-semibold mb-4">Position Value</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      formatMoney(Number(value ?? 0))
                    }
                  />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass overflow-x-auto p-4 rounded-xl shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b border-slate-200">
              <th className="p-2">Symbol</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Avg Cost</th>
              <th className="p-2">Price</th>
              <th className="p-2">Value</th>
              <th className="p-2">P/L</th>
              <th className="p-2">Allocation</th>
            </tr>
          </thead>
          <tbody>
            {data.positions.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No positions yet. Start investing to grow your pet.
                </td>
              </tr>
            )}

            {data.positions.map((p) => (
              <tr
                key={p.symbol}
                className="border-t border-slate-200/70 hover:bg-slate-50 transition"
              >
                <td className="p-2 font-semibold">{p.symbol}</td>
                <td className="p-2">{p.quantity}</td>
                <td className="p-2">{formatMoney(p.avg_cost)}</td>
                <td className="p-2">{formatMoney(p.market_price)}</td>
                <td className="p-2">{formatMoney(p.market_value)}</td>
                <td
                  className={`p-2 font-medium ${
                    p.unrealized_pl >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {formatSignedMoney(p.unrealized_pl)}
                </td>
                <td className="p-2">{p.allocation_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* KPI Component */
function KPI({
  title,
  value,
  positive,
}: {
  title: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="glass p-5 rounded-xl shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p
        className={`text-2xl font-semibold ${
          positive === undefined
            ? ""
            : positive
            ? "text-emerald-600"
            : "text-red-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
}