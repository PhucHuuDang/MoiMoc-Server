import { UserSelectTypes } from "src/drizzle/schema/user.schema";

export type AuthJwtPayload = {
  sub: UserSelectTypes;
};
