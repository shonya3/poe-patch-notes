import { createFileRoute, Link } from "@tanstack/react-router";
import { fallback, object, picklist } from "valibot";
import { getThreadContentFn } from "~/server/functions";
import { TocSidebar } from "~/components/TocSidebar";
import { PATCH_NOTES_0_5_THREAD_IDS } from "~/consts";
import threadProseCss from "./thread-prose.css?url";

const ThreadSearchSchema = object({ lang: fallback(picklist(["en", "ru"]), "en") });

export const Route = createFileRoute("/thread/$threadId")({
  validateSearch: ThreadSearchSchema,
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: async ({ params, deps }) => {
    return {
      ...(await getThreadContentFn({ data: { threadId: params.threadId } })),
      lang: deps.lang,
    };
  },
  component: ThreadPage,
  head: ({ params }) => ({
    meta: (PATCH_NOTES_0_5_THREAD_IDS as readonly string[]).includes(params.threadId)
      ? [{ property: "og:image", content: "/img/RotAInfographic.webp" }]
      : [],
    links: [{ rel: "stylesheet", href: threadProseCss }],
  }),
});

function ThreadPage() {
  const { content, toc, forumUrl, subforumId, subforumName, lang } = Route.useLoaderData();
  return (
    <div className="container thread-layout">
      <div className="thread-content">
        {subforumId && subforumName && (
          <Link
            to="/forum/$forumId"
            params={{ forumId: subforumId }}
            search={{ page: 1, lang }}
            className="forum-breadcrumb"
          >
            ← {subforumName}
          </Link>
        )}
        <a href={forumUrl} className="forum-link" target="_blank">
          View on forum →
        </a>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {toc.length > 0 && <TocSidebar items={toc} />}
    </div>
  );
}
