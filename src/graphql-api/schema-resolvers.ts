import BaseResolver from "./base/base-resolver";
import { ImageResolver } from "./image/resolvers/image-resolver";
import PollOptionResolver from "./poll/resolvers/poll-option-resolver";
import PollResolver from "./poll/resolvers/poll-resolver";
import UserResolver from "./user/resolvers/user-resolver";

export default [
  BaseResolver,
  UserResolver,
  ImageResolver,
  PollResolver,
  PollOptionResolver,
];
