import { UserProfile } from "./UserProfile";

const chief = new UserProfile("Гупало Іван", "finance", {
  canEditUsers: true,
  canApproveBudget: true,
  canAccessInternalTools: true,
});

const deputy = chief.clone() as UserProfile;

deputy.username = "Коваль Максим";
deputy.permissions.canEditUsers = false;

console.log(chief);
console.log(deputy);
