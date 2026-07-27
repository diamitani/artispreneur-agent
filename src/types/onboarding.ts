export type OperatingMode = "artist" | "agency" | "label";

export interface OnboardingIntake {
  // Step 1: Identity
  mode: OperatingMode;
  artistName: string;
  realName?: string;
  genre: string;
  subGenres?: string[];

  // Step 2: Stage & Goals
  careerStage: "emerging" | "developing" | "established" | "veteran";
  primaryGoals: string[];
  currentChallenges: string[];

  // Step 3: Voice & Brand
  brandAdjectives: string[];
  communicationStyle: "formal" | "casual" | "edgy" | "professional";
  targetAudience?: string;

  // Step 4: Operations
  hasDistributor: boolean;
  distributor?: string;
  hasPro: boolean;
  pro?: string;
  hasManager: boolean;
  monthlyBudget?: "none" | "under500" | "500to2000" | "over2000";
  priorities: string[];
}

export interface SoulMd {
  identity: {
    name: string;
    mode: OperatingMode;
    genre: string;
    stage: string;
  };
  mission: string;
  voice: {
    tone: string;
    style: string;
    audience: string;
  };
  permissions: {
    canSend: boolean;
    canPublish: boolean;
    canSpend: boolean;
    approvalRequired: string[];
  };
  context: {
    goals: string[];
    challenges: string[];
    resources: Record<string, string>;
  };
  roster: string[];
}
