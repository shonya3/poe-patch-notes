import { Nav } from "./Nav";
import cssUrl from "../index.css?url";

export function Layout({
  title,
  path,
  siteUrl,
  description,
  image,
  children,
}: {
  title: string;
  path?: string;
  siteUrl?: string;
  description?: string;
  image?: string;
  children: any;
}) {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description || "Path of Exile patch notes reader"} />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={description || "Path of Exile patch notes reader"}
        />
        <meta property="og:type" content="website" />
        {siteUrl && <meta property="og:url" content={siteUrl} />}
        {image && siteUrl && (
          <meta property="og:image" content={new URL(image, siteUrl).toString()} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(!t)t="system";if(t==="system")document.documentElement.removeAttribute("data-scheme");else document.documentElement.setAttribute("data-scheme",t)})()`,
          }}
        />
        <link rel="stylesheet" href={cssUrl} />
        {import.meta.env.DEV && <script type="module" src="/@vite/client" />}
      </head>
      <body>
        <Nav path={path} />
        <main class="main">{children}</main>
        <script
          dangerouslySetInnerHTML={{
            __html: `var b=document.getElementById("theme-toggle");var t=document.documentElement.getAttribute("data-scheme");b.textContent=t==="dark"?"Dark":t==="light"?"Light":"System";b.addEventListener("click",function(){var t=document.documentElement.getAttribute("data-scheme");if(!t||t==="system"){document.documentElement.setAttribute("data-scheme","light");localStorage.setItem("theme","light");this.textContent="Light"}else if(t==="light"){document.documentElement.setAttribute("data-scheme","dark");localStorage.setItem("theme","dark");this.textContent="Dark"}else{document.documentElement.removeAttribute("data-scheme");localStorage.setItem("theme","system");this.textContent="System"}})`,
          }}
        />
      </body>
    </html>
  );
}
