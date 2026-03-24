import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createSample(patientName : Text, sampleSource : Text, sampleType : Text, handler : Text, notes : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create samples");
    };

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

  public shared ({ caller }) func addTestToSample(sampleId : Nat, testCode : Text, testName : Text, department : Text, requiredSampleType : Text, turnaroundDays : Nat, isAllergyProfile : Bool) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add tests");
    };

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

  public shared ({ caller }) func updateSampleStatus(sampleId : Nat, status : SampleStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update sample status");
    };

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

  public shared ({ caller }) func updateSample(sampleId : Nat, patientName : Text, sampleSource : Text, sampleType : Text, handler : Text, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update samples");
    };

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

  public shared ({ caller }) func updateSampleReferral(sampleId : Nat, referredTo : ?Text, referralReturned : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update sample referral");
    };

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

  public shared ({ caller }) func updateTestStatus(testId : Nat, status : TestStatus, resultNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update test status");
    };

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

  public query ({ caller }) func getSamples() : async [LaboratorySample] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view samples");
    };
    samples.values().toArray().sort();
  };

  public query ({ caller }) func getSampleById(sampleId : Nat) : async LaboratorySample {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view samples");
    };
    switch (samples.get(sampleId)) {
      case (null) { Runtime.trap("Sample not found") };
      case (?sample) { sample };
    };
  };

  public query ({ caller }) func getSampleTests(sampleId : Nat) : async [LaboratorySampleTest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tests");
    };
    tests.values().toArray().filter(func(test) { test.sampleId == sampleId }).sort();
  };

  public query ({ caller }) func searchSamples(patientName : Text) : async [LaboratorySample] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search samples");
    };
    samples.values().toArray().filter(func(sample) { sample.patientName.contains(#text patientName) }).sort();
  };

  public query ({ caller }) func getSamplesByStatus(status : SampleStatus) : async [LaboratorySample] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view samples");
    };
    samples.values().toArray().filter(func(sample) { sample.status == status }).sort();
  };

  public query ({ caller }) func getDashboardStats() : async {
    total : Nat;
    pending : Nat;
    inProgress : Nat;
    completed : Nat;
    referred : Nat;
    resultsReceived : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };

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

  public shared ({ caller }) func deleteSample(sampleId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete samples");
    };

    if (not samples.containsKey(sampleId)) {
      Runtime.trap("Sample not found, cannot delete...");
    };
    samples.remove(sampleId);
  };
};
