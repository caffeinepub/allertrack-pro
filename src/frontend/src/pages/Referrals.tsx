import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRightLeft, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { SampleStatus } from "../backend.d";
import { useSamples, useUpdateSampleReferral } from "../hooks/useQueries";
import { formatDate } from "../lib/formatters";

export default function Referrals() {
  const { data: samples = [], isLoading } = useSamples();
  const updateReferral = useUpdateSampleReferral();

  const referred = samples.filter((s) => s.status === SampleStatus.referred);

  const handleMarkReturned = async (
    sampleId: bigint,
    referredTo: string | undefined,
  ) => {
    try {
      await updateReferral.mutateAsync({
        sampleId,
        referredTo: referredTo ?? null,
        referralReturned: true,
      });
      toast.success("Marked as returned");
    } catch {
      toast.error("Failed to update referral");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Referrals
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track samples sent to external laboratories
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-purple-200 shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <ArrowRightLeft size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">
                {referred.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Referred</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">
                {referred.filter((s) => s.referralReturned).length}
              </p>
              <p className="text-xs text-muted-foreground">Returned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRightLeft size={16} className="text-primary" />
              Referred Samples
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : referred.length === 0 ? (
              <div
                data-ocid="referrals.list.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <ArrowRightLeft size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No referred samples</p>
                <p className="text-sm mt-1">
                  Samples with &quot;Referred&quot; status will appear here
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Referred To
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Referred Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Return Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referred.map((s, idx) => (
                    <tr
                      key={s.id.toString()}
                      data-ocid={`referrals.list.item.${idx + 1}`}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        <Link
                          to="/samples/$id"
                          params={{ id: s.id.toString() }}
                          className="hover:text-primary transition-colors"
                        >
                          {s.patientName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {s.referredTo || (
                          <span className="italic text-muted-foreground/50">
                            Not specified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(s.receivedDate)}
                      </td>
                      <td className="px-4 py-3">
                        {s.referralReturned ? (
                          <Badge className="bg-success/10 text-green-700 border-success/20 gap-1">
                            <CheckCircle2 size={11} /> Returned
                          </Badge>
                        ) : (
                          <Badge className="bg-warning/10 text-amber-700 border-warning/20 gap-1">
                            <Clock size={11} /> Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to="/samples/$id"
                            params={{ id: s.id.toString() }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                            >
                              View
                            </Button>
                          </Link>
                          {!s.referralReturned && (
                            <Button
                              data-ocid={`referrals.mark_returned.button.${idx + 1}`}
                              size="sm"
                              className="text-xs h-7 bg-success hover:bg-success/90 text-white"
                              onClick={() =>
                                handleMarkReturned(s.id, s.referredTo)
                              }
                              disabled={updateReferral.isPending}
                            >
                              {updateReferral.isPending ? (
                                <Loader2 size={11} className="animate-spin" />
                              ) : (
                                "Mark Returned"
                              )}
                            </Button>
                          )}
                        </div>
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
