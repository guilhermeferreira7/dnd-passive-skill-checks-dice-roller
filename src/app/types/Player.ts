export type Player = {
  id: number;
  name: string;
  skills: {
    arcana: number;
    history: number;
    investigation: number;
    nature: number;
    religion: number;
    perception: number;
    insight: number;
  };
};
