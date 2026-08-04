const ISO_DATE_LENGTH = 10;

const longFmt = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortFmt = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const formatDate = (
  raw: string | Date | undefined,
  variant: "long" | "short",
): { display: string; iso: string } | undefined => {
  if (raw === undefined) {
    return undefined;
  }
  const date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return {
    display: (variant === "short" ? shortFmt : longFmt).format(date),
    iso: date.toISOString().slice(0, ISO_DATE_LENGTH),
  };
};

export const useFormattedDate = (
  source: MaybeRefOrGetter<string | Date | undefined>,
  variant: "long" | "short" = "long",
): ComputedRef<{ display: string; iso: string } | undefined> =>
  computed(() => formatDate(toValue(source), variant));
