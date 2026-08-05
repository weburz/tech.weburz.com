const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  weekday: "long",
  year: "numeric",
});

export const formatDate = (
  raw: string | Date | undefined,
): string | undefined => {
  if (raw === undefined) {
    return undefined;
  }

  const date = raw instanceof Date ? raw : new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return dateFmt.format(date);
};
