import {
    Navigation,
    HeroSection,
    CompanyIdentity,
    ProductsEcosystem,
    AutomationSection,
    TargetAudience,
    TechnologyTrust,
    CTASection,
    Footer
} from '@/components/sections';

export default function Home() {
    return (
        <>
            <Navigation />
            <main>
                <HeroSection />
                <CompanyIdentity />
                <ProductsEcosystem />
                <AutomationSection />
                <TargetAudience />
                <TechnologyTrust />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
