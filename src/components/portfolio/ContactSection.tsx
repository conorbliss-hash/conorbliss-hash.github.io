import { Mail, Linkedin, FileDown } from "lucide-react";

import cvAsset from "@/assets/conor-bliss-cv.pdf.asset.json";
import { trackEvent } from "@/lib/analytics";

const EMAIL = "conor.bliss.henaghan@gmail.com";

const ContactSection = () => {
  return (
    <section id="contact" className="py-10 md:py-14">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-[28px] md:text-4xl font-semibold mb-8 tracking-tight">
            Get in touch
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => trackEvent("Outbound Click", { destination: "email" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              {EMAIL}
            </a>
            <a
              href="https://www.linkedin.com/in/conor-bliss/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("Outbound Click", { destination: "contact-linkedin" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:border-primary/50 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={cvAsset.url}
              download="Conor-Bliss-CV.pdf"
              onClick={() => trackEvent("Outbound Click", { destination: "cv-download" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:border-primary/50 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
