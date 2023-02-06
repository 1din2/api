import { ulid } from "ulid";
import slugFn from "slug";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const atonic = require("atonic");

export const removeDiacritics = (str: string): string => atonic(str);

export const slug = (name: string) => slugFn(name);

/**
 * Generate an uniq id.
 */
export function generateUniqueId() {
  return ulid().toLowerCase();
}

/**
 * Generate an uniq short id.
 */
export function generateShortUniqueId() {
  return ulid().toLowerCase().substring(6);
}

export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const isPositiveNumber = (value: unknown): value is number =>
  isNumber(value) && value >= 0;

/**
 * Generate a random int
 * @param min min value
 * @param max max value
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const omitFieldsByValue = <T extends object>(
  obj: T,
  values: unknown[]
): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = { ...obj };
  for (const key of Object.keys(result))
    if (values.includes(result[key])) delete result[key];
  return result as T;
};

export const omitNullFields = <T extends object>(obj: T): T =>
  omitFieldsByValue(obj, [null]);

export const dateAddDays = (count: number, date: Date = new Date()) => {
  const output = new Date(date);
  output.setDate(date.getDate() + count);
  return output;
};

export const uniq = <T>(arr: T[]) => [...new Set(arr)];

/**
 * Checks if value is not one of: undefined, null, or empty string
 * @param value any value
 * @returns
 */
export const hasValue = (value?: unknown) =>
  ![undefined, null, ""].includes(value as never);
