import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  FileCheck,
  FlaskConical,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import type { SampleStatus } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useDashboardStats, useSamples } from "../hooks/useQueries";
import { formatDate } from "../lib/formatters";
import { seedExampleData } from "../lib/seedData";

const STAT_CARDS = [
  {
    key: "total" as const,
    label: "Total Samples",
    icon: FlaskConical,
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    key: "pending" as const,
    label: "Pending",
    icon: Clock,
    color: "from-warning/20 to-warning/5",
    iconColor: "text-amber-600",
    borderColor: "border-warning/20",
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: Activity,
    color: "from-info/20 to-info/5",
    iconColor: "text-blue-600",
    borderColor: "border-info/20",
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: CheckCircle2,
    color: "from-success/20 to-success/5",
    iconColor: "text-green-600",
    borderColor: "border-success/20",
  },
  {
    key: "referred" as const,
    label: "Referred",
    icon: ArrowRightLeft,
    color: "from-purple-200/50 to-purple-100/30",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    key: "resultsReceived" as const,
    label: "Results Received",
    icon: FileCheck,
    color: "from-primary/20 to-secondary/10",
    iconColor: "text-teal-600",
    borderColor: "border-primary/20",
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: samples, isLoading: samplesLoading } = useSamples();
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (actor && !isFetching) {
      seedExampleData(actor);
    }
  }, [actor, isFetching]);

  const recentSamples = samples?.slice(-5).reverse() ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome to AllerTrack Pro — Ultimate Medical Laboratories
          </p>
        </div>
        <Link to="/new-sample">
          <Button
            data-ocid="dashboard.add_sample.button"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5"
          >
            <FlaskConical size={16} className="mr-2" />
            Add New Sample
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {STAT_CARDS.map(
          ({ key, label, icon: Icon, color, iconColor, borderColor }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Card
                data-ocid={`dashboard.${key}.card`}
                className={`border ${borderColor} shadow-card overflow-hidden`}
              >
                <CardContent className="p-4">
                  <div
                    className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${color} mb-3`}
                  >
                    <Icon size={16} className={iconColor} />
                  </div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-12 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold font-display text-foreground">
                      {stats ? Number(stats[key]) : 0}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground font-medium">
                    {label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ),
        )}
      </div>

      {/* Recent Samples Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card className="shadow-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <CardTitle className="text-base font-semibold">
                Recent Samples
              </CardTitle>
            </div>
            <Link to="/samples">
              <Button
                variant="outline"
                size="sm"
                data-ocid="dashboard.view_all.button"
                className="text-xs border-primary/30 text-primary hover:bg-primary/5"
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {samplesLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentSamples.length === 0 ? (
              <div
                data-ocid="dashboard.samples.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <FlaskConical size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  No samples yet. Add your first sample to get started.
                </p>
                <Link to="/new-sample">
                  <Button variant="outline" size="sm" className="mt-3">
                    Add Sample
                  </Button>
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Sample Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Received
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Handler
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {recentSamples.map((s, idx) => (
                    <tr
                      key={s.id.toString()}
                      data-ocid={`dashboard.sample.item.${idx + 1}`}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {s.patientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {s.sampleType}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(s.receivedDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {s.handler}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status as SampleStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to="/samples/$id"
                          params={{ id: s.id.toString() }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary hover:text-primary hover:bg-primary/5"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
