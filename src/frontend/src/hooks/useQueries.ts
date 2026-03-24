import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LaboratorySample,
  LaboratorySampleTest,
  SampleStatus,
  TestStatus,
} from "../backend.d";
import { useActor } from "./useActor";

export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor)
        return {
          total: 0n,
          pending: 0n,
          inProgress: 0n,
          completed: 0n,
          referred: 0n,
          resultsReceived: 0n,
        };
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSamples() {
  const { actor, isFetching } = useActor();
  return useQuery<LaboratorySample[]>({
    queryKey: ["samples"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSamples();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSampleById(sampleId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LaboratorySample>({
    queryKey: ["sample", sampleId?.toString()],
    queryFn: async () => {
      if (!actor || sampleId === null) throw new Error("No actor or id");
      return actor.getSampleById(sampleId);
    },
    enabled: !!actor && !isFetching && sampleId !== null,
  });
}

export function useSampleTests(sampleId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LaboratorySampleTest[]>({
    queryKey: ["sampleTests", sampleId?.toString()],
    queryFn: async () => {
      if (!actor || sampleId === null) return [];
      return actor.getSampleTests(sampleId);
    },
    enabled: !!actor && !isFetching && sampleId !== null,
  });
}

export function useSearchSamples(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<LaboratorySample[]>({
    queryKey: ["searchSamples", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchSamples(query);
    },
    enabled: !!actor && !isFetching && !!query.trim(),
  });
}

export function useCreateSample() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      patientName: string;
      sampleSource: string;
      sampleType: string;
      handler: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createSample(
        data.patientName,
        data.sampleSource,
        data.sampleType,
        data.handler,
        data.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["samples"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useAddTestToSample() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sampleId: bigint;
      testCode: string;
      testName: string;
      department: string;
      requiredSampleType: string;
      turnaroundDays: bigint;
      isAllergyProfile: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addTestToSample(
        data.sampleId,
        data.testCode,
        data.testName,
        data.department,
        data.requiredSampleType,
        data.turnaroundDays,
        data.isAllergyProfile,
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["sampleTests", vars.sampleId.toString()],
      });
    },
  });
}

export function useUpdateSampleStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sampleId,
      status,
    }: { sampleId: bigint; status: SampleStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSampleStatus(sampleId, status);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["sample", vars.sampleId.toString()] });
      qc.invalidateQueries({ queryKey: ["samples"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateSampleReferral() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sampleId,
      referredTo,
      referralReturned,
    }: {
      sampleId: bigint;
      referredTo: string | null;
      referralReturned: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSampleReferral(sampleId, referredTo, referralReturned);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["sample", vars.sampleId.toString()] });
      qc.invalidateQueries({ queryKey: ["samples"] });
    },
  });
}

export interface UpdateTestStatusInput {
  testId: bigint;
  status: TestStatus;
  resultNotes: string;
  sampleId: bigint;
}

export function useUpdateTestStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTestStatusInput) => {
      if (!actor) throw new Error("No actor");
      return actor.updateTestStatus(
        input.testId,
        input.status,
        input.resultNotes,
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["sampleTests", vars.sampleId.toString()],
      });
    },
  });
}

export function useDeleteSample() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sampleId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSample(sampleId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["samples"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateSample() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sampleId: bigint;
      patientName: string;
      sampleSource: string;
      sampleType: string;
      handler: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSample(
        data.sampleId,
        data.patientName,
        data.sampleSource,
        data.sampleType,
        data.handler,
        data.notes,
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["sample", vars.sampleId.toString()] });
      qc.invalidateQueries({ queryKey: ["samples"] });
    },
  });
}
