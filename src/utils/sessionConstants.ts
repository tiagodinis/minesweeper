/*
Tile state transitions
    * Idle <--> Hovered
    * Hovered <--> Flagged
    * Hovered --> Revealed
    * Hovered --> LosingMine
    * Flagged --> WrongFlag
*/

export enum TileInteraction {
  MouseEnter,
  MouseLeave,
  LeftClick,
  RightClick,
}

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

export enum SessionState {
  Idle,
  Anticipation,
  JustFlagged,
  Confused,
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

export type Settings = { cols: number; rows: number; nrMines: number };
export const DifficultySettings: {
  Easy: Settings;
  Medium: Settings;
  Hard: Settings;
  Custom: Settings;
} = {
  Easy: { cols: 9, rows: 9, nrMines: 10 },
  Medium: { cols: 16, rows: 16, nrMines: 40 },
  Hard: { cols: 24, rows: 16, nrMines: 70 },
  Custom: { cols: 0, rows: 0, nrMines: 0 },
};
