import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Info,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddTestToSample, useCreateSample } from "../hooks/useQueries";
import {
  DEPARTMENTS,
  SAMPLE_SOURCES,
  SAMPLE_TYPES,
  TEST_CATALOG,
  type TestDefinition,
} from "../lib/testCatalog";

const MLS_STAFF = ["Daisy Goche, MLS", "Charles Gwatumba, MLS"];

export default function NewSample() {
  const navigate = useNavigate();
  const createSample = useCreateSample();
  const addTest = useAddTestToSample();

  const [form, setForm] = useState({
    patientName: "",
    sampleSource: "",
    sampleType: "",
    handler: "",
    notes: "",
  });
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(
    new Set(DEPARTMENTS),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTest = (code: string) => {
    setSelectedTests((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const toggleDept = (dept: string) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(dept)) next.delete(dept);
      else next.add(dept);
      return next;
    });
  };

  const getSelectedTestDefs = (): TestDefinition[] =>
    TEST_CATALOG.filter((t) => selectedTests.has(t.code));

  const calcExpectedDate = (tat: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + tat);
    return d.toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim() || !form.sampleType || !form.handler) {
      toast.error("Please fill in Patient Name, Sample Type, and Handler");
      return;
    }
    if (selectedTests.size === 0) {
      toast.error("Please select at least one test");
      return;
    }
    setIsSubmitting(true);
    try {
      const sampleId = await createSample.mutateAsync(form);
      const tests = getSelectedTestDefs();
      await Promise.all(
        tests.map((t) =>
          addTest.mutateAsync({
            sampleId,
            testCode: t.code,
            testName: t.name,
            department: t.department,
            requiredSampleType: t.requiredSampleType,
            turnaroundDays: BigInt(t.isAllergyProfile ? 21 : t.turnaroundDays),
            isAllergyProfile: t.isAllergyProfile ?? false,
          }),
        ),
      );
      toast.success("Sample created successfully!");
      navigate({ to: "/samples/$id", params: { id: sampleId.toString() } });
    } catch {
      toast.error("Failed to create sample. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">
          New Sample
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Register a new patient sample and select required tests
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical size={16} className="text-primary" />
                Patient &amp; Sample Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="patientName">
                    Patient Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="patientName"
                    data-ocid="new_sample.patient_name.input"
                    placeholder="Full patient name"
                    value={form.patientName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, patientName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="handler">
                    Handler / Authorized By{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.handler}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, handler: v }))
                    }
                  >
                    <SelectTrigger
                      id="handler"
                      data-ocid="new_sample.handler.select"
                    >
                      <SelectValue placeholder="Select authorized MLS" />
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
                <div className="space-y-1.5">
                  <Label htmlFor="sampleSource">Sample Source</Label>
                  <Select
                    value={form.sampleSource}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, sampleSource: v }))
                    }
                  >
                    <SelectTrigger
                      id="sampleSource"
                      data-ocid="new_sample.sample_source.select"
                    >
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPLE_SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sampleType">
                    Sample Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.sampleType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, sampleType: v }))
                    }
                  >
                    <SelectTrigger
                      id="sampleType"
                      data-ocid="new_sample.sample_type.select"
                    >
                      <SelectValue placeholder="Select sample type" />
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
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    data-ocid="new_sample.notes.textarea"
                    placeholder="Any additional notes..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Test Catalog */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  Test Catalog
                </CardTitle>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {selectedTests.size} selected
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {DEPARTMENTS.map((dept) => {
                const tests = TEST_CATALOG.filter((t) => t.department === dept);
                const isExpanded = expandedDepts.has(dept);
                const deptSelected = tests.filter((t) =>
                  selectedTests.has(t.code),
                ).length;
                return (
                  <div
                    key={dept}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      data-ocid={`new_sample.dept_${dept.toLowerCase().replace(/[^a-z]/g, "_")}.toggle`}
                      onClick={() => toggleDept(dept)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {dept}
                        </span>
                        {deptSelected > 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                            {deptSelected}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {tests.length} tests
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tests.map((test) => {
                          const isSelected = selectedTests.has(test.code);
                          const tat = test.isAllergyProfile
                            ? 21
                            : test.turnaroundDays;
                          const tatLabel =
                            tat === 0
                              ? "4 hrs"
                              : `${tat} day${tat !== 1 ? "s" : ""}`;
                          const checkId = `test-${test.code.toLowerCase()}`;
                          return (
                            <div
                              key={test.code}
                              data-ocid={`new_sample.test_${test.code.toLowerCase()}.checkbox`}
                              onClick={() => toggleTest(test.code)}
                              onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter")
                                  toggleTest(test.code);
                              }}
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary/40 bg-primary/5"
                                  : "border-border hover:border-primary/30 hover:bg-muted/30"
                              }`}
                            >
                              <Checkbox
                                id={checkId}
                                checked={isSelected}
                                onCheckedChange={() => toggleTest(test.code)}
                                className="mt-0.5"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1 min-w-0">
                                <Label
                                  htmlFor={checkId}
                                  className="text-sm font-medium text-foreground leading-tight cursor-pointer"
                                >
                                  {test.name}
                                </Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-secondary/10 text-secondary font-medium">
                                    {test.requiredSampleType}
                                  </span>
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    {test.volume}
                                  </span>
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                      test.isAllergyProfile
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-success/10 text-green-700"
                                    }`}
                                  >
                                    TAT: {tatLabel}
                                  </span>
                                  {isSelected && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                      ETA: {calcExpectedDate(tat)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected tests summary */}
        {selectedTests.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Selected Tests ({selectedTests.size})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getSelectedTestDefs().map((t) => (
                    <span
                      key={t.code}
                      className="text-xs px-2 py-1 rounded-full bg-white border border-primary/20 text-foreground font-medium"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/samples" })}
            data-ocid="new_sample.cancel.button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            data-ocid="new_sample.submit.button"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Sample"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
