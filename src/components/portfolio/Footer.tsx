import React from 'react'
// @ts-ignore
import LegacyFooter from '@/components/legacy-website/Footer'

export default function Footer() {
  try {
    // @ts-ignore
    return <LegacyFooter />
  } catch (e) {
    return (
      <footer className="py-8">
        <p>© {new Date().getFullYear()}</p>
      </footer>
    )
  }
}
const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg font-semibold">
            <span className="text-gradient">Portfolio</span>
          </p>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} All rights reserved. Built with passion.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;