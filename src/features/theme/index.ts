import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import * as v from "valibot";

export const COLOR_SCHEME_KEY = "color-scheme";

export const COLOR_SCHEME_VARIANTS = ["dark", "light"] as const;
export const ColorSchemeSchema = v.fallback(v.picklist(COLOR_SCHEME_VARIANTS), "dark");

export const getThemeFn = createServerFn({ method: "GET" }).handler(() => {
  return v.parse(ColorSchemeSchema, getCookie(COLOR_SCHEME_KEY));
});
