import { createFileRoute } from "@tanstack/react-router";
import { getThreadContentFn } from "~/server/functions";
import { TocSidebar } from "~/components/TocSidebar";

export const Route = createFileRoute("/thread/$threadId")({
  loader: async ({ params }) => {
    return getThreadContentFn({ data: { threadId: params.threadId } });
  },
  component: ThreadPage,
  head: ({ loaderData }) => ({
    meta: [{ property: "og:image", content: "/img/RotAInfographic.webp" }],
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
