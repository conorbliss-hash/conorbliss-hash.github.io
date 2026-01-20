import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-10 md:py-16 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a 
              href="https://github.com/conorbliss-hash" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/conor-bliss/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a 
              href="https://medium.com/@conor.bliss.henaghan" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
              <span className="text-sm">Medium</span>
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-muted-foreground text-sm text-center max-w-lg">
            Work examples are redacted and/or recreated with synthetic data to protect client confidentiality.
          </p>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Conor Bliss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
