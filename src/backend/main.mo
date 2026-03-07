import Runtime "mo:core/Runtime";
import Float "mo:core/Float";

actor {
  public type StressPrediction = {
    stressed : Bool;
    confidence : Float;
    method : Text;
  };

  public shared ({ caller }) func processTextAnalysisResult(isStressed : Bool, confidence : Float) : async StressPrediction {
    {
      stressed = isStressed;
      confidence;
      method = "text";
    };
  };

  public shared ({ caller }) func processFacialAnalysisResult(isStressed : Bool, confidence : Float) : async StressPrediction {
    {
      stressed = isStressed;
      confidence;
      method = "facial";
    };
  };

  public shared ({ caller }) func processVoiceAnalysisResult(isStressed : Bool, confidence : Float) : async StressPrediction {
    {
      stressed = isStressed;
      confidence;
      method = "voice";
    };
  };

  public query ({ caller }) func getStressDetectionMethods() : async [Text] {
    ["text", "facial", "voice"];
  };
};
