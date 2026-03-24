import type { SampleStatus, TestStatus } from "../backend.d";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  TEST_STATUS_COLORS,
  TEST_STATUS_LABELS,
} from "../lib/formatters";

export function StatusBadge({ status }: { status: SampleStatus }) {
  const colors = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}

export function TestStatusBadge({ status }: { status: TestStatus }) {
  const colors = TEST_STATUS_COLORS[status];
  const label = TEST_STATUS_LABELS[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {label}
    </span>
  );
}
