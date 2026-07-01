import { FileCheck, AlertTriangle, Scale, Users, GraduationCap, Shield, Heart } from "lucide-react";

export default function LiabilityDisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <FileCheck className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Liability Disclaimer</h1>
          <p className="text-sm text-muted-foreground">Exemption from liability statement</p>
        </div>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-4">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong className="text-destructive">Exemption from liability statement — Hackathon Prototype.</strong> This document establishes that this application is a demonstration project and not a certified product.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            1. Project Nature
          </h2>
          <p>
            This system was developed as part of <strong>Hackathon EPIS XXI — "Innovating for Peru"</strong>, Category B: Vanguard (Generative AI), organized by the National University of San Cristóbal de Huamanga (UNSCH).
          </p>
          <div className="p-4 bg-muted/50 rounded-xl border">
            <p className="text-sm">
              <strong>Stella Team</strong><br />
              Isaias Ramos Lopez — Code: 27202506<br />
              John Carlos Solca Prado — Code: 27210502<br />
              UNSCH — Professional School of Systems Engineering
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            2. Exclusion of Liability
          </h2>
          <p>The Stella team and UNSCH assume no responsibility for:</p>
          <div className="grid gap-3">
            {[
              { title: "Pedagogical support prototype (MVP)", desc: "This tool is a demonstration prototype, not a finished or certified product." },
              { title: "Does not constitute official evaluation", desc: "Does not replace official evaluations or teacher decisions." },
              { title: "Completely fictitious data", desc: "All student data is invented; does not represent real minors." },
              { title: "AI recommendations", desc: "Generated suggestions are guidance, not diagnoses or prescriptions." },
              { title: "No affiliation with MINEDU", desc: "We are not affiliated, endorsed or approved by the Ministry of Education of Peru." },
              { title: "Does not replace SIAGIE", desc: "Does not replace official educational management systems like SIAGIE." },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg border flex items-start gap-3">
                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">{item.title}</p>
                  <p className="text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            3. Known Limitations
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Risk classification based on simplified rules (not machine learning)</li>
            <li>AI-generated recommendations may contain inaccuracies</li>
            <li>Does not consider real family, socioeconomic or emotional context</li>
            <li>Demonstration dataset does not reflect real student diversity</li>
            <li>No clinical or certified pedagogical validation</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">4. Responsible Use</h2>
          <p>
            This tool should only be used as a <strong>demonstrative reference</strong> of what a teacher support system could be. Any pedagogical decision must be based on the professional judgment of the teacher and official protocols.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            5. Development Team
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Isaias Ramos Lopez</p>
              <p className="text-sm">Code: 27202506</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground">John Carlos Solca Prado</p>
              <p className="text-sm">Code: 27210502</p>
            </div>
          </div>
          <p className="text-center text-sm mt-4">
            UNSCH — Professional School of Systems Engineering
          </p>
        </section>

        <section className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3">
            <Heart className="w-5 h-5 text-primary" />
            <p className="text-sm">
              Developed with <strong>dedication</strong> for Hackathon EPIS XXI — Innovating for Peru
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
