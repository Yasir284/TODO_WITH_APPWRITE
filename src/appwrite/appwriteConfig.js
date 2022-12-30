import { Client, Account, Databases } from "appwrite";

const PROJECT_ID = process.env.REACT_APP_PROJECT_ID;

const client = new Client();

client.setEndpoint("http://localhost:81/v1").setProject(PROJECT_ID);

export const account = new Account(client);

export const databases = new Databases(client);
