import { createFileRoute } from "@tanstack/react-router";
import { getThreadContentFn } from "~/server/functions";
import { TocSidebar } from "~/components/TocSidebar";
import { PATCH_NOTES_0_5_THREAD_IDS } from "~/consts";

export const Route = createFileRoute("/thread/$threadId")({
  loader: async ({ params }) => {
    return getThreadContentFn({ data: { threadId: params.threadId } });
  },
  component: ThreadPage,
  head: ({ params }) => ({
    meta: (PATCH_NOTES_0_5_THREAD_IDS as readonly string[]).includes(params.threadId)
      ? [{ property: "og:image", content: "/img/RotAInfographic.webp" }]
      : [],
  }),
});

function ThreadPage() {
  const { content, toc, forumUrl } = Route.useLoaderData();
  return (
    <div className="container thread-layout">
      <div className="thread-content">
        <a href={forumUrl} className="forum-link" target="_blank">
          View on forum →
        </a>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {toc.length > 0 && <TocSidebar items={toc} />}
    </div>
  );
}
