import { useTranslations } from "next-intl";

export const useWhatWeBuildServices = () => {
  const t = useTranslations("whatWeBuildPage");

  return [
    {
      slug: "custom-websites",
      order: "01",
      titleFallback: t("customWebsitesTitle", {
        fallback: "Custom Websites",
      }),
      descriptionFallback: t("customWebsitesDescription", {
        fallback:
          "We create fully tailored websites designed around your vision and goals. Whether it's a personal project, portfolio, or service-based website, every detail is crafted to reflect your identity while maintaining usability and performance.",
      }),
      includedItems: [
        {
          fallback: t("customWebsitesIncludedResponsiveDesign", {
            fallback: "Responsive design across all devices",
          }),
        },
        {
          fallback: t("customWebsitesIncludedCleanStructure", {
            fallback: "Clean structure and intuitive navigation",
          }),
        },
        {
          fallback: t("customWebsitesIncludedSeoFoundation", {
            fallback: "SEO-friendly foundation",
          }),
        },
        {
          fallback: t("customWebsitesIncludedFastLoading", {
            fallback: "Fast loading and optimized performance",
          }),
        },
        {
          fallback: t("customWebsitesIncludedScalableArchitecture", {
            fallback: "Scalable architecture for future growth",
          }),
        },
      ],
    },
    {
      slug: "web-applications",
      order: "02",
      titleFallback: t("webApplicationsTitle", {
        fallback: "Web Applications",
      }),
      descriptionFallback: t("webApplicationsDescription", {
        fallback:
          "For more advanced needs, we build web applications that go beyond static pages. These solutions include custom functionality, user interactions, and system logic tailored to your specific requirements.",
      }),
      includedItems: [
        {
          fallback: t("webApplicationsIncludedCustomFeatures", {
            fallback: "Custom features and user flows",
          }),
        },
        {
          fallback: t("webApplicationsIncludedSecureLogic", {
            fallback: "Secure data handling and system logic",
          }),
        },
        {
          fallback: t("webApplicationsIncludedScalableArchitecture", {
            fallback: "Scalable and modular architecture",
          }),
        },
        {
          fallback: t("webApplicationsIncludedIntegrations", {
            fallback: "Integration with third-party tools",
          }),
        },
        {
          fallback: t("webApplicationsIncludedBackendStructure", {
            fallback: "Performance-focused backend structure",
          }),
        },
      ],
    },
    {
      slug: "ui-ux-design",
      order: "03",
      titleFallback: t("uiUxDesignTitle", {
        fallback: "UI/UX Design",
      }),
      descriptionFallback: t("uiUxDesignDescription", {
        fallback:
          "Design is not just about appearance - it's about how your product works. We create interfaces that feel natural, structured, and easy to navigate, ensuring a smooth experience for every user.",
      }),
      includedItems: [
        {
          fallback: t("uiUxDesignIncludedWireframing", {
            fallback: "Wireframing and interface planning",
          }),
        },
        {
          fallback: t("uiUxDesignIncludedUserCentered", {
            fallback: "User-centered design approach",
          }),
        },
        {
          fallback: t("uiUxDesignIncludedVisualLayouts", {
            fallback: "Clean and modern visual layouts",
          }),
        },
        {
          fallback: t("uiUxDesignIncludedDesignSystems", {
            fallback: "Consistent design systems",
          }),
        },
        {
          fallback: t("uiUxDesignIncludedUsability", {
            fallback: "Improved usability and clarity",
          }),
        },
      ],
    },
    {
      slug: "ecommerce-solutions",
      order: "04",
      titleFallback: t("ecommerceSolutionsTitle", {
        fallback: "E-Commerce Solutions",
      }),
      descriptionFallback: t("ecommerceSolutionsDescription", {
        fallback:
          "We build online stores that are simple to manage and easy to use. The focus is on creating a seamless experience - from product browsing to checkout - while ensuring stability and performance.",
      }),
      includedItems: [
        {
          fallback: t("ecommerceSolutionsIncludedCatalog", {
            fallback: "Product and catalog setup",
          }),
        },
        {
          fallback: t("ecommerceSolutionsIncludedCheckout", {
            fallback: "Secure checkout experience",
          }),
        },
        {
          fallback: t("ecommerceSolutionsIncludedMobileFlow", {
            fallback: "Mobile-optimized shopping flow",
          }),
        },
        {
          fallback: t("ecommerceSolutionsIncludedIntegrations", {
            fallback: "Payment and system integrations",
          }),
        },
        {
          fallback: t("ecommerceSolutionsIncludedOptimization", {
            fallback: "Performance and speed optimization",
          }),
        },
      ],
    },
    {
      slug: "landing-pages",
      order: "05",
      titleFallback: t("landingPagesTitle", {
        fallback: "Landing Pages",
      }),
      descriptionFallback: t("landingPagesDescription", {
        fallback:
          "Landing pages are designed with one goal in mind - clear communication and focused action. We create pages that guide users naturally, without distraction or unnecessary elements.",
      }),
      includedItems: [
        {
          fallback: t("landingPagesIncludedMessaging", {
            fallback: "Clear structure and messaging",
          }),
        },
        {
          fallback: t("landingPagesIncludedLayout", {
            fallback: "Conversion-focused layout",
          }),
        },
        {
          fallback: t("landingPagesIncludedResponsive", {
            fallback: "Fast-loading and responsive design",
          }),
        },
        {
          fallback: t("landingPagesIncludedTools", {
            fallback: "Integration with tools or forms",
          }),
        },
        {
          fallback: t("landingPagesIncludedFlow", {
            fallback: "Optimized user flow",
          }),
        },
      ],
    },
    {
      slug: "website-redesign",
      order: "06",
      titleFallback: t("websiteRedesignTitle", {
        fallback: "Website Redesign",
      }),
      descriptionFallback: t("websiteRedesignDescription", {
        fallback:
          "If your current website no longer reflects your vision or performs effectively, we help transform it into a modern, structured, and efficient product.",
      }),
      includedItems: [
        {
          fallback: t("websiteRedesignIncludedDesign", {
            fallback: "Design and layout improvements",
          }),
        },
        {
          fallback: t("websiteRedesignIncludedStructure", {
            fallback: "Structural and UX enhancements",
          }),
        },
        {
          fallback: t("websiteRedesignIncludedPerformance", {
            fallback: "Performance upgrades",
          }),
        },
        {
          fallback: t("websiteRedesignIncludedContent", {
            fallback: "Content reorganization",
          }),
        },
        {
          fallback: t("websiteRedesignIncludedRebuild", {
            fallback: "Modern, responsive rebuild",
          }),
        },
      ],
    },
    {
      slug: "performance-optimization",
      order: "07",
      titleFallback: t("performanceOptimizationTitle", {
        fallback: "Performance Optimization",
      }),
      descriptionFallback: t("performanceOptimizationDescription", {
        fallback:
          "Speed and performance directly impact user experience. We analyze and improve your website or application to ensure it runs efficiently and reliably.",
      }),
      includedItems: [
        {
          fallback: t("performanceOptimizationIncludedSpeed", {
            fallback: "Speed and loading optimization",
          }),
        },
        {
          fallback: t("performanceOptimizationIncludedRefinement", {
            fallback: "Code and asset refinement",
          }),
        },
        {
          fallback: t("performanceOptimizationIncludedResponsiveness", {
            fallback: "Improved responsiveness",
          }),
        },
        {
          fallback: t("performanceOptimizationIncludedAudits", {
            fallback: "Performance audits and fixes",
          }),
        },
        {
          fallback: t("performanceOptimizationIncludedStability", {
            fallback: "Stability improvements",
          }),
        },
      ],
    },
    {
      slug: "maintenance-support",
      order: "08",
      titleFallback: t("maintenanceSupportTitle", {
        fallback: "Maintenance & Support",
      }),
      descriptionFallback: t("maintenanceSupportDescription", {
        fallback:
          "Digital products require ongoing care. We provide continuous support to keep your project secure, updated, and functioning without interruptions.",
      }),
      includedItems: [
        {
          fallback: t("maintenanceSupportIncludedUpdates", {
            fallback: "Regular updates and monitoring",
          }),
        },
        {
          fallback: t("maintenanceSupportIncludedBugFixes", {
            fallback: "Bug fixes and issue resolution",
          }),
        },
        {
          fallback: t("maintenanceSupportIncludedPerformance", {
            fallback: "Performance checks",
          }),
        },
        {
          fallback: t("maintenanceSupportIncludedFeatures", {
            fallback: "Feature updates if needed",
          }),
        },
        {
          fallback: t("maintenanceSupportIncludedSupport", {
            fallback: "Ongoing technical support",
          }),
        },
      ],
    },
  ];
};
