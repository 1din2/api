import {
  Resolver,
  Query,
  Directive,
  ObjectType,
  Arg,
  Field,
} from "type-graphql";
import { AllErrorCodes } from "./types/types";

@ObjectType("TestItem")
class TestItem {
  @Field()
  id!: string;

  @Field()
  name!: string;
}

const testItems: TestItem[] = [
  { id: "1", name: "test1" },
  { id: "2", name: "test2" },
  { id: "3", name: "test3" },
];

@Resolver()
export default class BaseResolver {
  @Query(() => [AllErrorCodes])
  @Directive("@cacheControl(maxAge: 3600)")
  errorCodes() {
    return Object.values(AllErrorCodes);
  }

  @Query(() => [TestItem])
  @Directive("@cacheControl(maxAge: 3600)")
  testItems() {
    return testItems;
  }

  @Query(() => TestItem, { nullable: true })
  @Directive("@cacheControl(maxAge: 3600)")
  testItem(@Arg("id") id: string) {
    return testItems.find((it) => it.id === id);
  }
}
