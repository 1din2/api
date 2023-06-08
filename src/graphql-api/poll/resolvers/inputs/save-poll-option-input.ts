import { Field, ID, InputType, Int } from "type-graphql";
import { SavePollOptionInput } from "../../../../domain/poll/usecase/save-poll-option-usecase";

@InputType("InputSavePollOption")
export class InputSavePollOption implements SavePollOptionInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => ID, { nullable: true })
  pollId?: string;

  @Field(() => ID, { nullable: true })
  imageId?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => Int, { nullable: true })
  priority?: number;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => ID, { nullable: true })
  webImageId?: string;

  @Field({ nullable: true })
  imageUrl?: string;
}
