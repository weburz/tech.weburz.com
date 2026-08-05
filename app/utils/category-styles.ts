export type CategoryName = "Infrastructure" | "Data" | "People" | "Open Source";

export interface CategoryStyle {
  from: string;
  to: string;
  icon: string;
}

const CATEGORY_STYLES: Record<CategoryName, CategoryStyle> = {
  Data: {
    from: "#dbeafe",
    icon: "i-lucide-database",
    to: "#1e40af",
  },
  Infrastructure: {
    from: "#d0dbe7",
    icon: "i-lucide-server",
    to: "#557ca2",
  },
  "Open Source": {
    from: "#fde047",
    icon: "i-lucide-package",
    to: "#557ca2",
  },
  People: {
    from: "#fff8cf",
    icon: "i-lucide-users",
    to: "#fcc800",
  },
};

const DEFAULT_STYLE: CategoryStyle = {
  from: "#cbd5e1",
  icon: "i-lucide-file-text",
  to: "#64748b",
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_STYLES);

const isCategoryName = (category: string): category is CategoryName =>
  category in CATEGORY_STYLES;

export const getCategoryStyle = (
  category: string | undefined,
): CategoryStyle => {
  if (category === undefined || category === "") {
    return DEFAULT_STYLE;
  }

  if (isCategoryName(category)) {
    return CATEGORY_STYLES[category];
  }

  return { ...DEFAULT_STYLE, icon: "i-lucide-tag" };
};
