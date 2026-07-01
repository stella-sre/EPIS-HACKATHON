import { FileText, Scale, AlertTriangle, Users, Shield, Clock } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Terms and Conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated: July 2026</p>
        </div>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-4">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong className="text-destructive">Important notice:</strong> This application is a prototype developed for Hackathon EPIS XXI — &quot;Innovating for Peru&quot;. It does not constitute a finished product or official service.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            1. Intended Use
          </h2>
          <p>
            This tool is a <strong>pedagogical support prototype (MVP)</strong> developed for demonstrative purposes for Hackathon EPIS XXI. Its purpose is to show how generative AI can assist teachers in early detection of at-risk students.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Does not replace the professional judgment of the teacher</li>
            <li>Does not constitute an official evaluation of any student</li>
            <li>Is not affiliated or approved by MINEDU</li>
            <li>Does not replace official systems such as SIAGIE</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            2. Fictitious Data
          </h2>
          <p>
            All student data shown in this application is <strong>completely fictitious</strong>. They have been generated solely for demonstrative purposes and do not represent real minors.
          </p>
          <p>Names, grades, attendance, and any other information are invented and have no relation to real people.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            3. Limitation of Liability
          </h2>
          <p>The Stella team and the National University of San Cristóbal de Huamanga (UNSCH) are not responsible for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Decisions made based on the outputs of this prototype</li>
            <li>Any loss or damage arising from the use of this application</li>
            <li>The accuracy, completeness, or usefulness of AI-generated recommendations</li>
            <li>Any misuse of the tool</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            4. Availability
          </h2>
          <p>As a hackathon prototype, we do not guarantee continuous service availability. The application may be removed or modified at any time without prior notice.</p>
        </section>
      </div>
    </div>
  );
}
