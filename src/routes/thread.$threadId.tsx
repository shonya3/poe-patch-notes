import { createFileRoute, Link } from "@tanstack/react-router";
import { getThreadContentFn } from "~/server/functions";
import { TocSidebar } from "~/components/TocSidebar";
import { PATCH_NOTES_0_5_THREAD_IDS } from "~/consts";
import threadProseCss from "./thread-prose.css?url";

export const Route = createFileRoute("/thread/$threadId")({
  loader: async ({ params }) => {
    return getThreadContentFn({ data: { threadId: params.threadId } });
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
  const { content, toc, forumUrl, subforumId, subforumName } = Route.useLoaderData();
  return (
    <div className="container thread-layout">
      <div className="thread-content">
        {subforumId && subforumName && (
          <Link to="/forum/$forumId" params={{ forumId: subforumId }} search={{ page: 1 }} className="forum-breadcrumb">
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
