import { BackendCredentials, BackendUser } from "@/app/api/v1/auth/authOptions";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: BackendUser;
    credentials?: BackendCredentials;
    tudocerto: boolean;
  }

  interface User extends BackendUser, BackendCredentials {}
}
