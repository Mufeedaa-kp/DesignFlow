import type {
  MoodBoardStatus,
} from "../types/moodboard.types";

export const moodBoardStatusLabels: Record<
  MoodBoardStatus,
  string
> = {
  draft: "Draft",
  submitted: "Submitted",
  changes_requested: "Changes Requested",
  approved: "Approved",
};

export const moodBoardStatusStyles: Record<
  MoodBoardStatus,
  string
> = {
  draft: "bg-panel text-muted",
  submitted: "bg-amber/10 text-amber",
  changes_requested: "bg-ember/10 text-ember",
  approved: "bg-olive/10 text-olive",
};
