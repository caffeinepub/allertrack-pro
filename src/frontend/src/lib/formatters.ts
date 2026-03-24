import { SampleStatus, TestStatus } from "../backend.d";

export function formatDate(timestamp: bigint | number | undefined): string {
  if (!timestamp) return "—";
  const ms = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Date(ms).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(timestamp: bigint | number | undefined): string {
  if (!timestamp) return "—";
  const ms = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Date(ms).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABELS: Record<SampleStatus, string> = {
  [SampleStatus.pending]: "Pending",
  [SampleStatus.inProgress]: "In Progress",
  [SampleStatus.completed]: "Completed",
  [SampleStatus.referred]: "Referred",
  [SampleStatus.resultsReceived]: "Results Received",
};

export const STATUS_COLORS: Record<
  SampleStatus,
  { bg: string; text: string; dot: string }
> = {
  [SampleStatus.pending]: {
    bg: "bg-warning/10",
    text: "text-amber-700",
    dot: "bg-warning",
  },
  [SampleStatus.inProgress]: {
    bg: "bg-info/10",
    text: "text-blue-700",
    dot: "bg-info",
  },
  [SampleStatus.completed]: {
    bg: "bg-success/10",
    text: "text-green-700",
    dot: "bg-success",
  },
  [SampleStatus.referred]: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  [SampleStatus.resultsReceived]: {
    bg: "bg-primary/10",
    text: "text-teal-700",
    dot: "bg-primary",
  },
};

export const TEST_STATUS_LABELS: Record<TestStatus, string> = {
  [TestStatus.pending]: "Pending",
  [TestStatus.inProgress]: "In Progress",
  [TestStatus.completed]: "Completed",
};

export const TEST_STATUS_COLORS: Record<
  TestStatus,
  { bg: string; text: string }
> = {
  [TestStatus.pending]: { bg: "bg-warning/10", text: "text-amber-700" },
  [TestStatus.inProgress]: { bg: "bg-info/10", text: "text-blue-700" },
  [TestStatus.completed]: { bg: "bg-success/10", text: "text-green-700" },
};
