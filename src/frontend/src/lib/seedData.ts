export async function seedExampleData(actor: any) {
  if (localStorage.getItem("allertrack_seeded")) return;

  try {
    const samples = [
      {
        patientName: "Tendai Moyo",
        sampleSource: "Clinic",
        sampleType: "EDTA Purple Top",
        handler: "Daisy Goche, MLS",
        notes: "",
        tests: [
          {
            testCode: "FBC",
            testName: "Full Blood Count",
            department: "Haematology",
            requiredSampleType: "EDTA Purple Top",
            turnaroundDays: 1n,
            isAllergyProfile: false,
          },
          {
            testCode: "CD4",
            testName: "CD4 Count",
            department: "Haematology",
            requiredSampleType: "EDTA Purple Top",
            turnaroundDays: 2n,
            isAllergyProfile: false,
          },
        ],
      },
      {
        patientName: "Rudo Chikwanda",
        sampleSource: "Ward A",
        sampleType: "Plain Yellow Top",
        handler: "Charles Gwatumba, MLS",
        notes: "",
        tests: [
          {
            testCode: "UE",
            testName: "Urea & Electrolytes",
            department: "Chemistry",
            requiredSampleType: "Plain Yellow Top",
            turnaroundDays: 1n,
            isAllergyProfile: false,
          },
          {
            testCode: "LFT",
            testName: "Liver Function Tests",
            department: "Chemistry",
            requiredSampleType: "Plain Yellow Top",
            turnaroundDays: 1n,
            isAllergyProfile: false,
          },
        ],
      },
      {
        patientName: "Farai Sithole",
        sampleSource: "OPD",
        sampleType: "Plain Yellow Top",
        handler: "Daisy Goche, MLS",
        notes: "Urgent - chest pain",
        tests: [
          {
            testCode: "TROP",
            testName: "Troponin-I",
            department: "Chemistry",
            requiredSampleType: "Plain Yellow Top",
            turnaroundDays: 0n,
            isAllergyProfile: false,
          },
          {
            testCode: "GLU",
            testName: "Glucose",
            department: "Chemistry",
            requiredSampleType: "Fluoride Grey Top",
            turnaroundDays: 0n,
            isAllergyProfile: false,
          },
        ],
      },
      {
        patientName: "Simba Nyamadzawo",
        sampleSource: "HIV Clinic",
        sampleType: "EDTA Purple Top",
        handler: "Charles Gwatumba, MLS",
        notes: "",
        tests: [
          {
            testCode: "VL",
            testName: "HIV-1 Viral Load",
            department: "Serology",
            requiredSampleType: "EDTA Purple Top",
            turnaroundDays: 5n,
            isAllergyProfile: false,
          },
          {
            testCode: "CD4",
            testName: "CD4 Count",
            department: "Haematology",
            requiredSampleType: "EDTA Purple Top",
            turnaroundDays: 2n,
            isAllergyProfile: false,
          },
        ],
      },
      {
        patientName: "Chipo Mhuriro",
        sampleSource: "Endocrine Clinic",
        sampleType: "Plain Yellow Top",
        handler: "Daisy Goche, MLS",
        notes: "",
        tests: [
          {
            testCode: "TSH",
            testName: "Thyroid Stimulating Hormone",
            department: "Immunochemistry",
            requiredSampleType: "Plain Yellow Top",
            turnaroundDays: 2n,
            isAllergyProfile: false,
          },
          {
            testCode: "FT4",
            testName: "Free Thyroxine (FT4)",
            department: "Immunochemistry",
            requiredSampleType: "Plain Yellow Top",
            turnaroundDays: 2n,
            isAllergyProfile: false,
          },
          {
            testCode: "HBA1C",
            testName: "Glycated Haemoglobin (HbA1C)",
            department: "Chemistry",
            requiredSampleType: "EDTA Purple Top",
            turnaroundDays: 2n,
            isAllergyProfile: false,
          },
        ],
      },
    ];

    for (const s of samples) {
      const sampleId = await actor.createSample(
        s.patientName,
        s.sampleSource,
        s.sampleType,
        s.handler,
        s.notes,
      );
      for (const t of s.tests) {
        await actor.addTestToSample(
          sampleId,
          t.testCode,
          t.testName,
          t.department,
          t.requiredSampleType,
          t.turnaroundDays,
          t.isAllergyProfile,
        );
      }
    }

    localStorage.setItem("allertrack_seeded", "true");
  } catch (err) {
    console.error("Failed to seed example data:", err);
  }
}
