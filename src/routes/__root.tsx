import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import * as React from "react";
import { Nav } from "~/components/Nav";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  notFoundComponent: () => (
    <div className="container">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go home</Link>
    </div>
  ),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: "Path of Exile patch notes reader" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        children: `(function(){var t=localStorage.getItem("theme");if(!t)t="system";if(t==="system")document.documentElement.removeAttribute("data-scheme");else document.documentElement.setAttribute("data-scheme",t)})()`,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav />
        <main className="main">{children}</main>
        <script
          dangerouslySetInnerHTML={{
            __html: `var b=document.getElementById("theme-toggle");var t=document.documentElement.getAttribute("data-scheme");b.textContent=t==="dark"?"Dark":t==="light"?"Light":"System";b.addEventListener("click",function(){var t=document.documentElement.getAttribute("data-scheme");if(!t||t==="system"){document.documentElement.setAttribute("data-scheme","light");localStorage.setItem("theme","light");this.textContent="Light"}else if(t==="light"){document.documentElement.setAttribute("data-scheme","dark");localStorage.setItem("theme","dark");this.textContent="Dark"}else{document.documentElement.removeAttribute("data-scheme");localStorage.setItem("theme","system");this.textContent="System"}})`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
