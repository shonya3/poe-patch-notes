import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import * as React from "react";
import { Nav } from "~/components/Nav";
import { COLOR_SCHEME_KEY, getThemeFn } from "~/features/theme";
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
  }),
  beforeLoad: async () => {
    const scheme = await getThemeFn();
    return { scheme };
  },
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { scheme } = Route.useRouteContext();

  return (
    <html lang="en" className={`${COLOR_SCHEME_KEY}--${scheme}`}>
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav />
        <main className="main">{children}</main>
        <Scripts />
      </body>
    </html>
  );
}
