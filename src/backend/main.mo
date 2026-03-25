import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  module LaboratorySample {
    public func compare(sample1 : LaboratorySample, sample2 : LaboratorySample) : Order.Order {
      Nat.compare(sample1.id, sample2.id);
    };
  };

  module LaboratorySampleTest {
    public func compare(test1 : LaboratorySampleTest, test2 : LaboratorySampleTest) : Order.Order {
      Nat.compare(test1.id, test2.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextSampleId = 0;
  var nextTestId = 0;

  type SampleStatus = {
    #pending;
    #inProgress;
    #completed;
    #referred;
    #resultsReceived;
  };

  type TestStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type LaboratorySample = {
    id : Nat;
    patientName : Text;
    receivedDate : Int;
    sampleSource : Text;
    sampleType : Text;
    handler : Text;
    status : SampleStatus;
    referredTo : ?Text;
    referralReturned : Bool;
    notes : Text;
    createdAt : Int;
  };

  type LaboratorySampleTest = {
    id : Nat;
    sampleId : Nat;
    testCode : Text;
    testName : Text;
    department : Text;
    requiredSampleType : Text;
    turnaroundDays : Nat;
    isAllergyProfile : Bool;
    expectedResultDate : Int;
    status : TestStatus;
    resultNotes : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let samples = Map.empty<Nat, LaboratorySample>();
  let tests = Map.empty<Nat, LaboratorySampleTest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared func createSample(patientName : Text, sampleSource : Text, sampleType : Text, handler : Text, notes : Text) : async Nat {
    let sampleId = nextSampleId;
    nextSampleId += 1;

    let newSample : LaboratorySample = {
      id = sampleId;
      patientName;
      receivedDate = Time.now();
      sampleSource;
      sampleType;
      handler;
      status = #pending;
      referredTo = null;
      referralReturned = false;
      notes;
      createdAt = Time.now();
    };

    samples.add(sampleId, newSample);
    sampleId;
  };

  public shared func addTestToSample(sampleId : Nat, testCode : Text, testName : Text, department : Text, requiredSampleType : Text, turnaroundDays : Nat, isAllergyProfile : Bool) : async Nat {
    if (not samples.containsKey(sampleId)) {
      Runtime.trap("Sample not found, cannot add test");
    };

    let testId = nextTestId;
    nextTestId += 1;

    let expectedResultDate = Time.now() + (turnaroundDays * 24 * 3600 * 1000000000);

    let newTest : LaboratorySampleTest = {
      id = testId;
      sampleId;
      testCode;
      testName;
      department;
      requiredSampleType;
      turnaroundDays;
      isAllergyProfile;
      expectedResultDate;
      status = #pending;
      resultNotes = "";
    };

    tests.add(testId, newTest);
    testId;
  };

  public shared func updateSampleStatus(sampleId : Nat, status : SampleStatus) : async () {
    switch (samples.get(sampleId)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?sample) {
        let updatedSample : LaboratorySample = {
          sample with status
        };
        samples.add(sampleId, updatedSample);
      };
    };
  };

  public shared func updateSample(sampleId : Nat, patientName : Text, sampleSource : Text, sampleType : Text, handler : Text, notes : Text) : async () {
    switch (samples.get(sampleId)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?sample) {
        let updatedSample : LaboratorySample = {
          sample with
          patientName;
          sampleSource;
          sampleType;
          handler;
          notes;
        };
        samples.add(sampleId, updatedSample);
      };
    };
  };

  public shared func updateSampleReferral(sampleId : Nat, referredTo : ?Text, referralReturned : Bool) : async () {
    switch (samples.get(sampleId)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?sample) {
        let updatedSample : LaboratorySample = {
          sample with
          referredTo;
          referralReturned;
        };
        samples.add(sampleId, updatedSample);
      };
    };
  };

  public shared func updateTestStatus(testId : Nat, status : TestStatus, resultNotes : Text) : async () {
    switch (tests.get(testId)) {
      case (null) { Runtime.trap("Test not found") };
      case (?test) {
        let updatedTest : LaboratorySampleTest = {
          test with
          status;
          resultNotes;
        };
        tests.add(testId, updatedTest);
      };
    };
  };

  public query func getSamples() : async [LaboratorySample] {
    samples.values().toArray().sort();
  };

  public query func getSampleById(sampleId : Nat) : async LaboratorySample {
    switch (samples.get(sampleId)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?sample) { sample };
    };
  };

  public query func getSampleTests(sampleId : Nat) : async [LaboratorySampleTest] {
    tests.values().toArray().filter(func(test) { test.sampleId == sampleId }).sort();
  };

  public query func searchSamples(patientName : Text) : async [LaboratorySample] {
    samples.values().toArray().filter(func(sample) { sample.patientName.contains(#text patientName) }).sort();
  };

  public query func getSamplesByStatus(status : SampleStatus) : async [LaboratorySample] {
    samples.values().toArray().filter(func(sample) { sample.status == status }).sort();
  };

  public query func getDashboardStats() : async {
    total : Nat;
    pending : Nat;
    inProgress : Nat;
    completed : Nat;
    referred : Nat;
    resultsReceived : Nat;
  } {
    let allSamples = samples.values().toArray();
    let total = allSamples.size();
    var pending = 0;
    var inProgress = 0;
    var completed = 0;
    var referred = 0;
    var resultsReceived = 0;

    for (sample in allSamples.vals()) {
      switch (sample.status) {
        case (#pending) { pending += 1 };
        case (#inProgress) { inProgress += 1 };
        case (#completed) { completed += 1 };
        case (#referred) { referred += 1 };
        case (#resultsReceived) { resultsReceived += 1 };
      };
    };

    {
      total;
      pending;
      inProgress;
      completed;
      referred;
      resultsReceived;
    };
  };

  public shared func deleteSample(sampleId : Nat) : async () {
    if (not samples.containsKey(sampleId)) {
      Runtime.trap("Sample not found, cannot delete...");
    };
    samples.remove(sampleId);
  };
};
