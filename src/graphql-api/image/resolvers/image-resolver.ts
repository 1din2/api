import { FieldResolver, Resolver, Root } from "type-graphql";
import { TypeImage } from "../types/type-image";
import { ImageData } from "../../../domain/image/entity/image";

@Resolver(() => TypeImage)
export class ImageResolver {
  @FieldResolver(() => String, { nullable: true })
  url(@Root() root: ImageData) {
    return root.url;
  }
}
