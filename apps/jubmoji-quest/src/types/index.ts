import { Prisma, Card, Quest, Power, $Enums, QRCode } from "@prisma/client";

export type InputSize = "sm" | "md" | "lg";

export interface BackupState {
  type: "google" | "apple" | "copypaste" | "whatsapp" | "none";
  serialNum?: string;
  backedUpPubKeyIndices?: number[];
}

export interface NullifiedSigs {
  quests: Record<number, string[]>; // questId -> nullified Jubmoji signatures
  powers: Record<number, string[]>; // powerId -> nullified Jubmoji signatures
}

export type JubmojiCollectionCard = Card & {
  prerequisitesFor: JubmojiQuestPreview[];
  collectsFor: JubmojiQuestPreview[];
};

export type JubmojiQuestPreview = {
  id: number;
  name: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
};

export type JubmojiQuest = Quest & {
  prerequisiteCards: { index: number }[];
  collectionCards: { index: number }[];
  powers: {
    id: number;
    name: string;
    description: string;
    powerType: $Enums.PowerType;
    proofType: $Enums.ProofType;
    proofParams: Prisma.JsonValue;
    prerequisiteCards: { index: number }[];
    collectionCards: { index: number }[];
  }[];
};

export type JubmojiPower = Power & {
  prerequisiteCards: { index: number }[];
  collectionCards: {
    index: number;
  }[];
  quest: {
    id: number;
    name: string;
    description: string;
    proofType: $Enums.ProofType;
    proofParams: Prisma.JsonValue;
    imageLink: string | null;
    prerequisiteCards: { index: number }[];
    collectionCards: {
      index: number;
    }[];
  };
};

export type JubmojiQRCodeData = QRCode & {
  power: JubmojiPower;
};

// Define the QuestBuilder class
export class QuestBuilder {
  name: string = "";
  description: string = "";
  startTime: Date | null = null;
  endTime: Date | null = null;
  isOfficial: boolean = false;
  isAlwaysVisible: boolean = false;
  prerequisiteCardIndices: number[] = [];
  collectionCardIndices: number[] = [];
  proofType: string = "IN_COLLECTION"; // Default value
  N: number | null = null;

  constructor(init?: Partial<QuestBuilder>) {
    Object.assign(this, init);
  }

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setStartTime(startTime: Date) {
    this.startTime = startTime;
  }

  setEndTime(endTime: Date) {
    this.endTime = endTime;
  }

  setIsOfficial(isOfficial: boolean) {
    this.isOfficial = isOfficial;
  }

  setIsAlwaysVisible(isAlwaysVisible: boolean) {
    this.isAlwaysVisible = isAlwaysVisible;
  }

  setPrerequisiteCardIndices(indices: number[]) {
    this.prerequisiteCardIndices = indices;
  }

  setCollectionCardIndices(indices: number[]) {
    this.collectionCardIndices = indices;
  }

  setProofType(proofType: string) {
    this.proofType = proofType;
  }

  setN(N: number) {
    this.N = N;
  }

  build() {
    return {
      name: this.name,
      description: this.description,
      startTime: this.startTime,
      endTime: this.endTime,
      isOfficial: this.isOfficial,
      isAlwaysVisible: this.isAlwaysVisible,
      prerequisiteCardIndices: this.prerequisiteCardIndices,
      collectionCardIndices: this.collectionCardIndices,
      proofType: this.proofType,
      N: this.N,
    };
  }
}