// Use type safe message keys with `next-intl`
type IntlMessages = {
  add: typeof import("./src/i18n/en/add.json"),
  archive: typeof import("./src/i18n/en/archive.json"),
  edit: typeof import("./src/i18n/en/edit.json"),
  index: typeof import("./src/i18n/en/index.json"),
  itemCard: typeof import("./src/i18n/en/itemCard.json"),
  "not-found": typeof import("./src/i18n/en/not-found.json"),
  "root-layout": typeof import("./src/i18n/en/root-layout.json"),
  settings: typeof import("./src/i18n/en/settings.json"),
};
type IntlMessages = Messages;
