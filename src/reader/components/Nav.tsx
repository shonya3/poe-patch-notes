const NAV_LINKS = [
  { href: "/thread/3932540", label: "0.5.0 EN" },
  { href: "/thread/3932617", label: "0.5.0 RU" },
];

export function Nav({ path }: { path?: string }) {
  return (
    <nav class="nav">
      <div class="nav-inner">
        <a href="/" class="nav-brand">
          Patch Notes
        </a>
        <div class="nav-links">
          {NAV_LINKS.map((l) => (
            <a href={l.href} class={"nav-link" + (path === l.href ? " active" : "")}>
              {l.label}
            </a>
          ))}
        </div>
        <button class="theme-toggle" id="theme-toggle"></button>
      </div>
    </nav>
  );
}
