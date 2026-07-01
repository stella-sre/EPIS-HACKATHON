import { Lock, Database, Shield, Eye, Trash2, UserCheck, AlertCircle, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: July 2026</p>
        </div>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-4">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong className="text-destructive">Important notice:</strong> This application is a prototype. <strong>We do not process real personal data</strong>. All shown data is fictitious.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            1. Data We Collect
          </h2>
          <p>
            This application is a <strong>demonstration prototype</strong>. The data stored in the PostgreSQL database is:
          </p>
          <div className="grid gap-4">
            <div className="p-4 bg-muted/50 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-2">Fictitious Student Data</h3>
              <p className="text-sm">
                Fictitious names, invented grades, simulated attendance records, and artificially generated risk assessments.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-2">Public Data Used as Context</h3>
              <p className="text-sm">
                Aggregated information from public sources such as ESCALE/MINEDU (names of educational institutions, rural/urban areas, district dropout rates). These are statistical data, not personal data.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-2">Technical Data</h3>
              <p className="text-sm">
                Theme preferences (light/dark) stored locally in your browser via technical cookies.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            2. How We Use Your Data
          </h2>
          <p>We do not collect personally identifiable personal data. The shown data is:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fictitious data generated solely for demonstration</li>
            <li>Aggregated public data from official sources (without personal information)</li>
            <li>Interface preferences (theme) stored locally</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            3. Data Protection
          </h2>
          <p>
            As a prototype without real data, we do not apply personal data protection measures. However, the system architecture is designed to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Not collect personally identifiable information</li>
            <li>Use only fictitious data for demonstrations</li>
            <li>Not share data with third parties</li>
            <li>Not use analytics or tracking services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-primary" />
            4. Retention and Deletion
          </h2>
          <p>
            The prototype&apos;s fictitious data persists in the PostgreSQL database. In a real production environment, this data would be deleted after the demonstration period.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            5. Your Rights
          </h2>
          <p>
            Since we do not process real personal data, data subject rights do not apply. If you have any questions about this prototype, you can contact the Stella team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            6. Contact
          </h2>
          <p>
            For questions about privacy related to this prototype, contact the Stella team through Hackathon EPIS XXI — UNSCH.
          </p>
        </section>
      </div>
    </div>
  );
}
