"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const Hero = dynamic(() => import("@/app/components/Hero"), { ssr: true });
const Header = dynamic(() => import("@/app/components/header/Header"), {
  ssr: true,
});

const HeroSection = dynamic(() => import("@/app/components/HeroSection"), {
  ssr: true,
});

const AboutSection = dynamic(() => import("@/app/components/AboutSection"), {
  ssr: true,
});

const CoreOfferingsSection = dynamic(
  () => import("@/app/components/CoreOfferingsSection"),
  {
    ssr: true,
  }
);

const ServicesSection = dynamic(
  () => import("@/app/components/ServicesSection"),
  {
    ssr: true,
  }
);

const WorkProcessSection = dynamic(
  () => import("@/app/components/WorkProcessSection"),
  {
    ssr: true,
  }
);

const ClientsSection = dynamic(
  () => import("@/app/components/ClientsSection"),
  {
    ssr: true,
  }
);

const ResourcesSection = dynamic(
  () => import("@/app/components/ResourcesSection"),
  {
    ssr: true,
  }
);

const Footer = dynamic(() => import("@/app/components/layout/Footer"), {
  ssr: true,
});

const CertificateSection = dynamic(
  () => import("@/app/components/CertificateSection"),
  {
    ssr: true,
  }
);

const CaseStudiesSection = dynamic(
  () => import("@/app/components/CaseStudiesSection"),
  {
    ssr: true,
  }
);

const BlogSection = dynamic(() => import("@/app/components/BlogSection"), {
  ssr: true,
});

const StoriesShowSection = dynamic(
  () => import("@/app/components/StoriesShowSection"),
  {
    ssr: true,
  }
);

const HeroHeaderSection = dynamic(
  () => import("@/app/components/HeroHeaderSection"),
  {
    ssr: true,
  }
);

const StoryTimelineSection = dynamic(
  () => import("@/app/components/StoryTimelineSection"),
  {
    ssr: true,
  }
);

const ContactSection = dynamic(
  () => import("@/app/components/ContactSection"),
  {
    ssr: true,
  }
);

const CoreValuesSection = dynamic(
  () => import("@/app/components/CoreValuesSection"),
  {
    ssr: true,
  }
);

const LeadershipTeamSection = dynamic(
  () => import("@/app/components/LeadershipTeamSection"),
  {
    ssr: true,
  }
);

const CultureEnvironmentSection = dynamic(
  () => import("@/app/components/CultureEnvironmentSection"),
  {
    ssr: true,
  }
);

const AchievementsSection = dynamic(
  () => import("@/app/components/AchievementsSection"),
  {
    ssr: true,
  }
);

const ProcessMethodologySection = dynamic(
  () => import("@/app/components/ProcessMethodologySection"),
  {
    ssr: true,
  }
);

const CommunityImpactSection = dynamic(
  () => import("@/app/components/CommunityImpactSection"),
  {
    ssr: true,
  }
);

const TechnologyInnovationSection = dynamic(
  () => import("@/app/components/TechnologyInnovationSection"),
  {
    ssr: true,
  }
);

export type ModuleComponentProps = {
  data: any;
};

const registry: Record<string, ComponentType<ModuleComponentProps>> = {
  hero: Hero,
  footer: Footer,
  header: Header,
  herosection: HeroSection,
  blogsection: BlogSection,
  aboutsection: AboutSection,
  resources: ResourcesSection,
  contactsection: ContactSection,
  clientssection: ClientsSection,
  servicessection: ServicesSection,
  heroheadersection: HeroHeaderSection,
  corevaluessection: CoreValuesSection,
  storiesshowsection: StoriesShowSection,
  certificatesection: CertificateSection,
  workprocesssection: WorkProcessSection,
  casestudiessection: CaseStudiesSection,
  achievementssection: AchievementsSection,
  storytimelinesection: StoryTimelineSection,
  coreofferingssection: CoreOfferingsSection,
  leadershipteamsection: LeadershipTeamSection,
  communityimpactsection: CommunityImpactSection,
  processmethodologysection: ProcessMethodologySection,
  cultureenvironmentsection: CultureEnvironmentSection,
  technologyinnovationsection: TechnologyInnovationSection,
};

export default registry;
