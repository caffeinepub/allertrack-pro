import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LaboratorySampleTest {
    id: bigint;
    status: TestStatus;
    turnaroundDays: bigint;
    testCode: string;
    resultNotes: string;
    testName: string;
    isAllergyProfile: boolean;
    expectedResultDate: bigint;
    requiredSampleType: string;
    department: string;
    sampleId: bigint;
}
export interface LaboratorySample {
    id: bigint;
    status: SampleStatus;
    handler: string;
    createdAt: bigint;
    sampleType: string;
    sampleSource: string;
    receivedDate: bigint;
    referredTo?: string;
    notes: string;
    patientName: string;
    referralReturned: boolean;
}
export interface UserProfile {
    name: string;
}
export enum SampleStatus {
    referred = "referred",
    pending = "pending",
    completed = "completed",
    resultsReceived = "resultsReceived",
    inProgress = "inProgress"
}
export enum TestStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTestToSample(sampleId: bigint, testCode: string, testName: string, department: string, requiredSampleType: string, turnaroundDays: bigint, isAllergyProfile: boolean): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSample(patientName: string, sampleSource: string, sampleType: string, handler: string, notes: string): Promise<bigint>;
    deleteSample(sampleId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<{
        total: bigint;
        referred: bigint;
        pending: bigint;
        completed: bigint;
        resultsReceived: bigint;
        inProgress: bigint;
    }>;
    getSampleById(sampleId: bigint): Promise<LaboratorySample>;
    getSampleTests(sampleId: bigint): Promise<Array<LaboratorySampleTest>>;
    getSamples(): Promise<Array<LaboratorySample>>;
    getSamplesByStatus(status: SampleStatus): Promise<Array<LaboratorySample>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchSamples(patientName: string): Promise<Array<LaboratorySample>>;
    updateSample(sampleId: bigint, patientName: string, sampleSource: string, sampleType: string, handler: string, notes: string): Promise<void>;
    updateSampleReferral(sampleId: bigint, referredTo: string | null, referralReturned: boolean): Promise<void>;
    updateSampleStatus(sampleId: bigint, status: SampleStatus): Promise<void>;
    updateTestStatus(testId: bigint, status: TestStatus, resultNotes: string): Promise<void>;
}
