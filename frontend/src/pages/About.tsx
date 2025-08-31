import { AboutLayout } from '@widgets/layout/AboutLayout';
import { Hero } from "@features/about/ui/Hero";
import { Mission } from "@features/about/ui/Mission";
import { Team } from "@features/about/ui/Team";
import { Partners } from "@features/about/ui/Partners";

export const About = () => (
    <AboutLayout>
        <Hero />
        <Mission />
        <Team />
        <Partners />
    </AboutLayout>
);