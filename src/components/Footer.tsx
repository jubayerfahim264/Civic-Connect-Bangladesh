const Footer = () => {
  return (
    <footer className="gradient-navy py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-accent-foreground">C</span>
              </div>
              <span className="font-heading text-lg font-bold text-primary-foreground">
                CivicConnect
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/60">
              Making government services accessible to every Bangladeshi citizen. Your one-stop platform for civic information.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-primary-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Services", "Updates", "About Us", "Contact"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-primary-foreground">
              Popular Services
            </h4>
            <ul className="space-y-2">
              {["E-Passport", "NID Card", "Birth Certificate", "Land Records"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
          © 2026 CivicConnect. Built for the people of Bangladesh.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
