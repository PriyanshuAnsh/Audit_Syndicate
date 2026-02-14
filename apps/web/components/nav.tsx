"use client";

import Link from "next/link";

const links = [
  ["Dashboard", "/dashboard"],
  ["Trade", "/trade"],
  ["Portfolio", "/portfolio"],
  ["Learn", "/learn"],
  ["Shop", "/shop"],
  ["Profile", "/profile"],
] as const;

export default function Nav() {
  return (
    <nav className="flex flex-wrap gap-3 border-b border-ink/20 pb-3 text-sm">
      {links.map(([label, href]) => (
        <Link className="rounded-full bg-white px-3 py-1 hover:bg-mint" key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
