import { Cookie, Shield, Settings, AlertCircle } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <Cookie className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: July 2026</p>
        </div>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            General Information
          </h2>
          <p>
            This application is a prototype developed for Hackathon EPIS XXI. We use cookies only for essential technical purposes to ensure the correct functioning of the system.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Types of Cookies Used
          </h2>
          <div className="grid gap-4">
            <div className="p-4 bg-muted/50 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-2">Essential Technical Cookies</h3>
              <p className="text-sm">
                Necessary for the application to function. Include theme preferences (light/dark), session management, and basic authentication functionality.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-2">Functionality Cookies</h3>
              <p className="text-sm">
                Allow remembering your preferences (such as language and regional settings) to offer you a more personalized experience.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            We Do NOT Use
          </h2>
          <ul className="list-disc pl-6 space-y-2 bg-destructive/5 border border-destructive/20 rounded-xl p-4">
            <li>Third-party tracking or analytics cookies</li>
            <li>Advertising or marketing cookies</li>
            <li>Integrated social media cookies</li>
            <li>Behavior tracking cookies</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">Cookie Control</h2>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies already on your computer and set most browsers to prevent them from being placed.
          </p>
          <div className="p-4 bg-muted/50 rounded-xl border">
            <p className="text-sm">
              <strong>Note:</strong> If you decide to block cookies, you may need to re-enter your information more frequently, or some features of the application may not work properly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
