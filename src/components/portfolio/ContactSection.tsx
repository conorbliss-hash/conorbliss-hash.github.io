import { Mail, Linkedin } from "lucide-react";

const EMAIL = "conor.bliss.henaghan@gmail.com";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Get in touch
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Open to AI leadership roles
          </h2>
          <p className="text-muted-foreground text-base mb-8 font-body">
            Stockholm or remote within CET ±2.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              {EMAIL}
            </a>
            <a
              href="https://www.linkedin.com/in/conor-bliss/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:border-primary/50 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
