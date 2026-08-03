import { Nav } from "./Nav";
import { Footer } from "./footer";

/** Shared SaaS marketing chrome — TasteSkill grain + DS nav/footer */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
