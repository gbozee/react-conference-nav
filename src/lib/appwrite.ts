import {
  Client,
  Account,
  Databases,
  Storage,
  Functions,
  Users,
} from "node-appwrite";

const APPWRITE_CONFIG = {
  endpoint: process.env.APPWRITE_ENDPOINT || "",
  projectId: process.env.APPWRITE_PROJECT_ID || "",
  apiKey: process.env.APPWRITE_API_KEY || "",
} as const;

console.log("APPWRITE_CONFIG", APPWRITE_CONFIG);

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)
    .setKey(APPWRITE_CONFIG.apiKey);

  const accountClient = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

  return {
    get accountClient() {
      return new Account(accountClient);
    },
    get users() {
      return new Users(client);
    },
    get account() {
      return new Account(client);
    },
    get functions() {
      return new Functions(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}
