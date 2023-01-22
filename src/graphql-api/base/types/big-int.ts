import { GraphQLScalarType, Kind } from "graphql";

const MAX_INT = Number.MAX_SAFE_INTEGER;
const MIN_INT = Number.MIN_SAFE_INTEGER;

const coerceBigInt = (value: unknown) => {
  if (value === "") {
    throw new TypeError(
      "BigInt cannot represent non 53-bit signed integer value: (empty string)"
    );
  }
  const num = Number(value);
  if (num > MAX_INT || num < MIN_INT || Number.isNaN(num)) {
    throw new TypeError(
      `BigInt cannot represent non 53-bit signed integer value: ${String(
        value
      )}`
    );
  }
  const int = Math.floor(num);
  if (int !== num) {
    throw new TypeError(
      `BigInt cannot represent non-integer value: ${String(value)}`
    );
  }
  return int;
};

export const BigIntType = new GraphQLScalarType({
  name: "BigInt",
  description:
    "The `BigInt` 53 bit scalar type. Exactly like Int, except it allows larger values",
  serialize: coerceBigInt,
  parseValue: coerceBigInt,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      const num = parseInt(ast.value, 10);
      if (num <= MAX_INT && num >= MIN_INT) {
        return num;
      }
    }
    throw new TypeError(`BigInt cannot represent non-integer values.`);
  },
});
