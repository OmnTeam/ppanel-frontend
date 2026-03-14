import { useTranslation } from "react-i18next";

export interface NavItem {
  title: string;
  url: string;
  icon: string;
}

export interface NavGroup {
  title: string;
  url?: string;
  icon?: string;
  items?: NavItem[];
}

export function useNavs() {
  const { t } = useTranslation("components");

  const navs: NavGroup[] = [
    {
      title: t("menu.dashboard", "Dashboard"),
      url: "/dashboard",
      icon: "uil:dashboard",
    },
    {
      title: t("menu.personal", "Personal"),
      items: [
        {
          title: t("menu.profile", "User Detail"),
          url: "/profile",
          icon: "uil:user",
        },
      ],
    },
    {
      title: t("menu.server", "Server Management"),
      items: [
        {
          url: "/subscribe",
          icon: "uil:shop",
          title: t("menu.subscribe", "Subscribe"),
        },
        {
          url: "/traffic",
          icon: "uil:chart-line",
          title: t("menu.traffic", "Traffic Statistics"),
        },
      ],
    },
    {
      title: t("menu.finance", "Commerce"),
      items: [
        {
          url: "/order",
          icon: "uil:notes",
          title: t("menu.order", "Order Management"),
        },
        {
          url: "/wallet",
          icon: "uil:wallet",
          title: t("menu.wallet", "Balance"),
        },
        {
          url: "/affiliate",
          icon: "uil:users-alt",
          title: t("menu.affiliate", "Commission"),
        },
      ],
    },
    {
      title: t("menu.help", "Users & Support"),
      items: [
        {
          url: "/document",
          icon: "uil:book-alt",
          title: t("menu.document", "Document Management"),
        },
        {
          url: "/announcement",
          icon: "uil:megaphone",
          title: t("menu.announcement", "Announcement Management"),
        },
        {
          url: "/ticket",
          icon: "uil:message",
          title: t("menu.ticket", "Ticket Management"),
        },
      ],
    },
  ];

  return navs;
}

export function useFindNavByUrl(url: string) {
  const navs = useNavs();

  for (const nav of navs) {
    if (nav.url && nav.url === url) {
      return [nav];
    }
    if (nav.items) {
      const current = nav.items.find((item) => item.url === url);
      if (current) {
        return [nav, current];
      }
    }
  }
  return [];
}

export function useNavItems() {
  const { t } = useTranslation("components");

  return [
    {
      url: "/profile",
      icon: "uil:user",
      title: t("menu.profile", "User Detail"),
    },
    {
      url: "/subscribe",
      icon: "uil:shop",
      title: t("menu.subscribe", "Subscribe"),
    },
    {
      url: "/order",
      icon: "uil:notes",
      title: t("menu.order", "Order Management"),
    },
    {
      url: "/wallet",
      icon: "uil:wallet",
      title: t("menu.wallet", "Balance"),
    },
  ];
}
