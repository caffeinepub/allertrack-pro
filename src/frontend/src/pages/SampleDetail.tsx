import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  FileText,
  FlaskConical,
  Loader2,
  MapPin,
  Tag,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { SampleStatus, TestStatus } from "../backend.d";
import { StatusBadge, TestStatusBadge } from "../components/StatusBadge";
import {
  useSampleById,
  useSampleTests,
  useUpdateSample,
  useUpdateSampleReferral,
  useUpdateSampleStatus,
  useUpdateTestStatus,
} from "../hooks/useQueries";
import {
  STATUS_LABELS,
  TEST_STATUS_LABELS,
  formatDate,
} from "../lib/formatters";
import { SAMPLE_TYPES } from "../lib/testCatalog";

const MLS_STAFF = ["Daisy Goche, MLS", "Charles Gwatumba, MLS"];

export default function SampleDetail() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const navigate = useNavigate();
  const sampleId = id ? BigInt(id) : null;

  const { data: sample, isLoading: sampleLoading } = useSampleById(sampleId);
  const { data: tests = [], isLoading: testsLoading } =
    useSampleTests(sampleId);
  const updateStatus = useUpdateSampleStatus();
  const updateReferral = useUpdateSampleReferral();
  const updateTestStatusMutation = useUpdateTestStatus();
  const updateSample = useUpdateSample();

  const [referredTo, setReferredTo] = useState("");
  const [referralReturned, setReferralReturned] = useState(false);
  const [testResultNotes, setTestResultNotes] = useState<
    Record<string, string>
  >({});

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    patientName: "",
    sampleSource: "",
    sampleType: "",
    handler: "",
    notes: "",
  });

  const startEditing = () => {
    if (!sample) return;
    setEditForm({
      patientName: sample.patientName,
      sampleSource: sample.sampleSource || "",
      sampleType: sample.sampleType,
      handler: sample.handler,
      notes: sample.notes || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const handleSaveEdit = async () => {
    if (!sampleId) return;
    try {
      await updateSample.mutateAsync({
        sampleId,
        patientName: editForm.patientName,
        sampleSource: editForm.sampleSource,
        sampleType: editForm.sampleType,
        handler: editForm.handler,
        notes: editForm.notes,
      });
      toast.success("Sample updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update sample");
    }
  };

  const handleStatusChange = async (status: SampleStatus) => {
    if (!sampleId) return;
    try {
      await updateStatus.mutateAsync({ sampleId, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleReferralSave = async () => {
    if (!sampleId) return;
    try {
      await updateReferral.mutateAsync({
        sampleId,
        referredTo: referredTo || null,
        referralReturned,
      });
      toast.success("Referral info saved");
    } catch {
      toast.error("Failed to save referral info");
    }
  };

  const handleTestStatusChange = async (testId: bigint, status: TestStatus) => {
    if (!sampleId) return;
    const notes = testResultNotes[testId.toString()] || "";
    try {
      await updateTestStatusMutation.mutateAsync({
        testId,
        status,
        resultNotes: notes,
        sampleId,
      });
      toast.success("Test status updated");
    } catch {
      toast.error("Failed to update test status");
    }
  };

  if (sampleLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Sample not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: "/samples" })}
        >
          Back to Samples
        </Button>
      </div>
    );
  }

  const isReferred = sample.status === SampleStatus.referred;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          data-ocid="sample_detail.back.button"
          onClick={() => navigate({ to: "/samples" })}
          className="gap-2"
        >
          <ArrowLeft size={14} />
          Back
        </Button>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            {sample.patientName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Sample ID: #{sample.id.toString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Patient info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User size={15} className="text-primary" />
                    Patient Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid="sample_detail.edit.button"
                      onClick={startEditing}
                      className="h-7 px-3 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                    >
                      <Edit2 size={12} />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        data-ocid="sample_detail.cancel.button"
                        onClick={cancelEditing}
                        className="h-7 px-3 text-xs gap-1"
                      >
                        <X size={12} />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        data-ocid="sample_detail.save_button"
                        onClick={handleSaveEdit}
                        disabled={updateSample.isPending}
                        className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                      >
                        {updateSample.isPending ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : null}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Patient Name</Label>
                      <Input
                        data-ocid="sample_detail.patient_name.input"
                        value={editForm.patientName}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            patientName: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Sample Source</Label>
                      <Input
                        data-ocid="sample_detail.sample_source.input"
                        value={editForm.sampleSource}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            sampleSource: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Sample Type</Label>
                      <Select
                        value={editForm.sampleType}
                        onValueChange={(v) =>
                          setEditForm((p) => ({ ...p, sampleType: v }))
                        }
                      >
                        <SelectTrigger
                          data-ocid="sample_detail.sample_type.select"
                          className="text-sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SAMPLE_TYPES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Handler / Authorized By</Label>
                      <Select
                        value={editForm.handler}
                        onValueChange={(v) =>
                          setEditForm((p) => ({ ...p, handler: v }))
                        }
                      >
                        <SelectTrigger
                          data-ocid="sample_detail.handler.select"
                          className="text-sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MLS_STAFF.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs">Notes</Label>
                      <Textarea
                        data-ocid="sample_detail.notes.textarea"
                        value={editForm.notes}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, notes: e.target.value }))
                        }
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      [
                        [User, "Patient", sample.patientName],
                        [Calendar, "Received", formatDate(sample.receivedDate)],
                        [MapPin, "Source", sample.sampleSource || "—"],
                        [Tag, "Sample Type", sample.sampleType],
                        [User, "Handler", sample.handler],
                        [Calendar, "Created", formatDate(sample.createdAt)],
                      ] as [React.ElementType, string, string][]
                    ).map(([Icon, label, value]) => (
                      <div key={label} className="flex items-start gap-2">
                        <Icon
                          size={13}
                          className="text-muted-foreground mt-0.5"
                        />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {label}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!isEditing && sample.notes && (
                  <div className="mt-4 pt-4 border-t border-border flex items-start gap-2">
                    <FileText
                      size={13}
                      className="text-muted-foreground mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Notes
                      </p>
                      <p className="text-sm text-foreground">{sample.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tests */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FlaskConical size={15} className="text-primary" />
                  Tests ({tests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {testsLoading ? (
                  [1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))
                ) : tests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No tests assigned to this sample
                  </p>
                ) : (
                  tests.map((test, idx) => (
                    <div
                      key={test.id.toString()}
                      data-ocid={`sample_detail.test.item.${idx + 1}`}
                      className="border border-border rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {test.testName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {test.department} &middot; {test.requiredSampleType}
                          </p>
                          {test.expectedResultDate > 0n && (
                            <p className="text-xs text-primary mt-0.5">
                              ETA: {formatDate(test.expectedResultDate)}
                            </p>
                          )}
                        </div>
                        <TestStatusBadge status={test.status as TestStatus} />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Textarea
                            placeholder="Result notes..."
                            value={
                              testResultNotes[test.id.toString()] ??
                              test.resultNotes
                            }
                            onChange={(e) =>
                              setTestResultNotes((p) => ({
                                ...p,
                                [test.id.toString()]: e.target.value,
                              }))
                            }
                            rows={1}
                            className="text-xs resize-none"
                          />
                        </div>
                        <Select
                          value={test.status}
                          onValueChange={(v) =>
                            handleTestStatusChange(test.id, v as TestStatus)
                          }
                        >
                          <SelectTrigger
                            data-ocid={`sample_detail.test_status.select.${idx + 1}`}
                            className="w-36 text-xs h-9"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(TestStatus).map((s) => (
                              <SelectItem key={s} value={s}>
                                {TEST_STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sample Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={sample.status as SampleStatus} />
                <Select
                  value={sample.status}
                  onValueChange={(v) => handleStatusChange(v as SampleStatus)}
                >
                  <SelectTrigger data-ocid="sample_detail.status.select">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SampleStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          {/* Referral */}
          {isReferred && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card className="shadow-card border-purple-200 bg-purple-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-purple-700">
                    Referral Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Referred To (Lab)</Label>
                    <Input
                      data-ocid="sample_detail.referred_to.input"
                      placeholder="Destination laboratory"
                      value={referredTo || sample.referredTo || ""}
                      onChange={(e) => setReferredTo(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      data-ocid="sample_detail.referral_returned.switch"
                      checked={referralReturned || sample.referralReturned}
                      onCheckedChange={setReferralReturned}
                    />
                    <Label className="text-xs">Referral Returned</Label>
                  </div>
                  <Button
                    size="sm"
                    data-ocid="sample_detail.save_referral.button"
                    onClick={handleReferralSave}
                    disabled={updateReferral.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  >
                    {updateReferral.isPending ? (
                      <Loader2 size={12} className="mr-2 animate-spin" />
                    ) : null}
                    Save Referral Info
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

import type React from "react";
