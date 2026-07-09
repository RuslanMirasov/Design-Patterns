import { UserProfilePrototype } from "./UserProfilePrototype";

export interface UserPermissions {
  canEditUsers: boolean;
  canApproveBudget: boolean;
  canAccessInternalTools: boolean;
}

export class UserProfile implements UserProfilePrototype {
  constructor(
    public username: string,
    public department: "finance" | "engineering" | "marketing",
    public permissions: UserPermissions,
  ) {}

  clone(): UserProfile {
    return new UserProfile(this.username, this.department, {
      ...this.permissions,
    });
  }
}
