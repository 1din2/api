import BaseResolver from "./base/base-resolver";
import { ImageResolver } from "./image/resolvers/image-resolver";
import UserResolver from "./user/resolvers/user-resolver";

export default [BaseResolver, UserResolver, ImageResolver];
