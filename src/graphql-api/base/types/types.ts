import {
  Field,
  ObjectType,
  registerEnumType,
  Int,
  ClassType,
  ID,
} from "type-graphql";
import { CursorPageInfo } from "../../../domain/base/cursor-pagination";
import { EntityData, EntityId } from "../../../domain/base/entity";
import { BaseErrorCode } from "../../../domain/base/errors";
import { UserErrorCode } from "../../../domain/user/errors";

export const AllErrorCodes = {
  ...BaseErrorCode,
  ...UserErrorCode,
};

registerEnumType(AllErrorCodes, { name: "ErrorCode" });

@ObjectType()
export class TypeBaseEntity implements EntityData {
  @Field(() => ID)
  id!: EntityId;

  @Field()
  createdAt!: number;

  @Field({ nullable: true })
  updatedAt!: number;
}

@ObjectType("PageInfo")
export class ConnectionPageInfo implements CursorPageInfo {
  @Field({ nullable: true })
  endCursor?: string;

  @Field({ nullable: true })
  hasNextPage!: boolean;
}

export type CursorPageEdge<T> = {
  node: T;
  cursor: string;
};

export function createCursorPageEdgeClass<TItem>(
  TItemClass: ClassType<TItem>
) {
  @ObjectType(`${TItemClass.name.replace(/^Type/, "")}CursorEdge`)
  class ConnectionPageEdge {
    @Field(() => TItemClass)
    node!: TItem;

    @Field()
    cursor!: string;
  }

  return ConnectionPageEdge;
}

export function CursorPageClass<TItem>(TItemClass: ClassType<TItem>) {
  const Edge = createCursorPageEdgeClass(TItemClass);

  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [Edge])
    edges!: CursorPageEdge<TItem>[];

    @Field(() => ConnectionPageInfo)
    pageInfo!: CursorPageInfo;

    @Field(() => Int)
    totalCount!: number;
  }
  return PaginatedResponseClass;
}
