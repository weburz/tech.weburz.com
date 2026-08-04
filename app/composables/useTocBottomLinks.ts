type PageRef = Ref<{ stem?: string; extension?: string } | null | undefined>;

interface TocBottomLink {
  icon: string;
  label: string;
  target: string;
  to: string;
}

export const useTocBottomLinks = (
  page: PageRef,
): ComputedRef<TocBottomLink[]> => {
  const { toc } = useAppConfig();
  return computed(() => {
    const out = [];
    if (toc.bottom.edit) {
      out.push({
        icon: "i-lucide-external-link",
        label: "Edit this page",
        target: "_blank",
        to: `${toc.bottom.edit}/${page.value?.stem}.${page.value?.extension}`,
      });
    }
    return [...out, ...toc.bottom.links].filter(Boolean);
  });
};
