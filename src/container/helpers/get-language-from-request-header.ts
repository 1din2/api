import normalizeLanguageCode from "./normalize-language-code";

export default (value: string | undefined | null): string | null =>
  (value && normalizeLanguageCode(value && value.split(/[,;]/)[0])) || null;
