export interface User {
  id: string;
  email: string;
  name: string;
  plan: "starter" | "workspace" | "agency";
  onboardingCompleted: boolean;
  bedrockAgentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  plan: string;
}
