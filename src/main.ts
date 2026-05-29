import handler from "@tanstack/react-start/server-entry";

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    return handler.fetch(request);
  },
};
