/*
Tile state transitions
    * Idle <--> Hovered
    * Hovered <--> Flagged
    * Hovered --> Revealed
    * Hovered --> LosingMine
    * Flagged --> WrongFlag
*/

export enum TileState {
  Idle = "Idle",
  Hovered = "Hovered",
  Flagged = "Flagged",
  Revealed = "Revealed",
  LosingMine = "LosingMine",
  WrongFlag = "WrongFlag",
}

/*
Session state transitions
* Start --> Idle
* Idle <--> Anticipation
* Idle <--> JustFlagged
* Anticipation --> Victory
* Anticipation --> GameOver
----------------------------
* Idle <--> Confused
* JustFlagged --> Confused
* Confused --> Anticipation
* Confused --> Victory
* Confused --> GameOver
*/

export enum InteractionState {
  Idle,
  Anticipation, // Avatar
  JustFlagged, // Avatar
  Confused, // Avatar
  Victory,
  GameOver,
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Custom = "Custom",
}

export type Adjacency = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Settings = [number, number, number];
export const DifficultySettings: {
  Easy: Settings;
  Medium: Settings;
  Hard: Settings;
  Custom: Settings;
} = {
  Easy: [9, 9, 10],
  Medium: [16, 16, 40],
  Hard: [24, 16, 70],
  Custom: [0, 0, 0],
};
