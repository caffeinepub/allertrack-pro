import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Atom, Building2, Shield, User } from "lucide-react";

export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          System configuration and information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 size={15} className="text-primary" />
              Laboratory Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Lab Name", "Ultimate Medical Laboratories"],
              ["System", "AllerTrack Pro"],
              ["Version", "1.0.0"],
              ["Platform", "Internet Computer"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield size={15} className="text-primary" />
              Authorization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Developed By", "Thabzizi"],
              ["Authorized By", "Daisy"],
              ["License", "Clinical Use"],
              ["Compliance", "ISO 15189"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold text-foreground">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Atom size={15} className="text-primary" />
              Test Catalog Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                ["Haematology", "8 tests", "bg-blue-50 text-blue-700"],
                ["Chemistry", "17 tests", "bg-teal-50 text-teal-700"],
                [
                  "Serology / Immunochemistry",
                  "23 tests",
                  "bg-purple-50 text-purple-700",
                ],
              ].map(([dept, count, colors]) => (
                <div key={dept} className={`rounded-xl p-3 ${colors}`}>
                  <p className="text-lg font-bold font-display">{count}</p>
                  <p className="text-xs font-medium">{dept}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
