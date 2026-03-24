import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type Actor = {
    nextSampleId : Nat;
    nextTestId : Nat;
    samples : Map.Map<Nat, LaboratorySample>;
    tests : Map.Map<Nat, LaboratorySampleTest>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };
  type LaboratorySample = {
    id : Nat;
    patientName : Text;
    receivedDate : Int;
    sampleSource : Text;
    sampleType : Text;
    handler : Text;
    status : {
      #pending;
      #inProgress;
      #completed;
      #referred;
      #resultsReceived;
    };
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
    status : {
      #pending;
      #inProgress;
      #completed;
    };
    resultNotes : Text;
  };
  public func run(old : Actor) : Actor {
    old;
  };
};
