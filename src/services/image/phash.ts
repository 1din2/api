// import assert from "assert";
// import sharp from "sharp";

// const DEFAULT_HASH_SIZE = 16;

// sharp.cache(false);

// export default async function (path: string | Buffer) {
//   const height = DEFAULT_HASH_SIZE;
//   const width = height + 1;

//   // Covert to small gray image
//   const pixels = await sharp(path)
//     .grayscale()
//     .resize({
//       fit: "fill",
//       kernel: "cubic",
//       fastShrinkOnLoad: true,
//       withoutEnlargement: true,
//       width,
//       height,
//     })
//     .raw()
//     .toBuffer();

//   let difference = "";
//   for (let row = 0; row < height; row++) {
//     for (let col = 0; col < height; col++) {
//       // height is not a mistake here...
//       const left = px(pixels, width, col, row);
//       const right = px(pixels, width, col + 1, row);
//       difference += left < right ? 1 : 0;
//     }
//   }
//   return binaryToHex(difference).toString("hex");
// }

// // TODO: move to a separate module
// function binaryToHex(s: string) {
//   let output = "";
//   for (let i = 0; i < s.length; i += 4) {
//     const bytes = s.substring(i, 4);
//     const decimal = parseInt(bytes, 2);
//     output += decimal.toString(16);
//   }
//   return Buffer.from(output, "hex");
// }

// function px(pixels: string | Buffer, width: number, x: number, y: number) {
//   const pixel = width * y + x;
//   assert(pixel < pixels.length);
//   return pixels[pixel];
// }
