export type eventCreate = {
  type: "goal" | "assist";
  id_player: number;
  id_assistido?: number;
  minute?: number;
};
