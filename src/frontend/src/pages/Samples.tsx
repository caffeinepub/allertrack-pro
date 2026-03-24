import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Eye, Filter, FlaskConical, Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SampleStatus } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import { useDeleteSample, useSamples } from "../hooks/useQueries";
import { STATUS_LABELS, formatDate } from "../lib/formatters";

export default function Samples() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: samples = [], isLoading } = useSamples();
  const deleteMutation = useDeleteSample();

  const filtered = useMemo(() => {
    let list = samples;
    if (search.trim()) {
      list = list.filter((s) =>
        s.patientName.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }
    return [...list].reverse();
  }, [samples, search, statusFilter]);

  const handleDelete = async (id: bigint, name: string) => {
    if (!confirm(`Delete sample for ${name}?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Sample deleted");
    } catch {
      toast.error("Failed to delete sample");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Samples
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {samples.length} total samples in the system
          </p>
        </div>
        <Link to="/new-sample">
          <Button
            data-ocid="samples.add_sample.button"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
          >
            <FlaskConical size={16} className="mr-2" />
            New Sample
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  data-ocid="samples.search.input"
                  placeholder="Search by patient name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  data-ocid="samples.status.select"
                  className="w-48"
                >
                  <Filter size={14} className="mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(SampleStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                data-ocid="samples.list.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <FlaskConical size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-medium">No samples found</p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Patient Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Received Date
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Sample Type
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Source
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Handler
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, idx) => (
                      <tr
                        key={s.id.toString()}
                        data-ocid={`samples.list.item.${idx + 1}`}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-foreground">
                          {s.patientName}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDate(s.receivedDate)}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                            {s.sampleType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {s.sampleSource || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {s.handler}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={s.status as SampleStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              to="/samples/$id"
                              params={{ id: s.id.toString() }}
                            >
                              <Button
                                data-ocid={`samples.view.button.${idx + 1}`}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
                              >
                                <Eye size={14} />
                              </Button>
                            </Link>
                            <Button
                              data-ocid={`samples.delete.button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(s.id, s.patientName)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
