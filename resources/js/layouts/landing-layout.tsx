import LandingFooterLayout from "./landing/landing-footer-layout";
import LandingHeaderLayout from "./landing/landing-header-layout";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingHeaderLayout />
      {children}
      <LandingFooterLayout />
    </>
  );
}