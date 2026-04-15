import { useTranslations } from "next-intl";

export const useSelectedWorkCases = () => {
  const t = useTranslations("selectedWorkPage");

  return [
    {
      slug: "personal-portfolio-platform",
      titleFallback: t("personalPortfolioPlatformTitle", {
        fallback: "Personal Portfolio Platform",
      }),
      overviewFallback: t("personalPortfolioPlatformOverview", {
        fallback:
          "A clean, minimal portfolio designed for an individual showcasing creative work and services.",
      }),
      challengeFallback: t("personalPortfolioPlatformChallenge", {
        fallback:
          "The client needed a structured way to present their work without overwhelming visitors, while keeping the design refined and professional.",
      }),
      solutionFallback: t("personalPortfolioPlatformSolution", {
        fallback:
          "We developed a custom website with a clear layout, smooth navigation, and responsive design, ensuring content remained the focal point.",
      }),
      featureItems: [
        {
          fallback: t("personalPortfolioPlatformFeature1", {
            fallback: "Minimal UI/UX design",
          }),
        },
        {
          fallback: t("personalPortfolioPlatformFeature2", {
            fallback: "Responsive layout",
          }),
        },
        {
          fallback: t("personalPortfolioPlatformFeature3", {
            fallback: "Structured content flow",
          }),
        },
        {
          fallback: t("personalPortfolioPlatformFeature4", {
            fallback: "Fast loading performance",
          }),
        },
      ],
    },
    {
      slug: "ecommerce-store-for-niche-products",
      titleFallback: t("ecommerceStoreForNicheProductsTitle", {
        fallback: "E-Commerce Store for Niche Products",
      }),
      overviewFallback: t("ecommerceStoreForNicheProductsOverview", {
        fallback:
          "An online store built for a small niche product business, focused on simplicity and usability.",
      }),
      challengeFallback: t("ecommerceStoreForNicheProductsChallenge", {
        fallback:
          "Creating a seamless shopping experience without unnecessary complexity or a heavy interface.",
      }),
      solutionFallback: t("ecommerceStoreForNicheProductsSolution", {
        fallback:
          "We combined a streamlined product structure with an intuitive checkout flow that keeps the buying journey clear and efficient.",
      }),
      featureItems: [
        {
          fallback: t("ecommerceStoreForNicheProductsFeature1", {
            fallback: "Product catalog setup",
          }),
        },
        {
          fallback: t("ecommerceStoreForNicheProductsFeature2", {
            fallback: "Secure checkout integration",
          }),
        },
        {
          fallback: t("ecommerceStoreForNicheProductsFeature3", {
            fallback: "Performance optimization",
          }),
        },
      ],
    },
    {
      slug: "service-based-website",
      titleFallback: t("serviceBasedWebsiteTitle", {
        fallback: "Service-Based Website",
      }),
      overviewFallback: t("serviceBasedWebsiteOverview", {
        fallback:
          "A multi-page website designed for an individual offering professional services.",
      }),
      challengeFallback: t("serviceBasedWebsiteChallenge", {
        fallback:
          "The client needed a clear way to communicate services and guide users toward inquiry or booking.",
      }),
      solutionFallback: t("serviceBasedWebsiteSolution", {
        fallback:
          "We structured the website with focused sections, strong visual hierarchy, and clear calls to action.",
      }),
      featureItems: [
        {
          fallback: t("serviceBasedWebsiteFeature1", {
            fallback: "Structured service layout",
          }),
        },
        {
          fallback: t("serviceBasedWebsiteFeature2", {
            fallback: "Contact form integration",
          }),
        },
        {
          fallback: t("serviceBasedWebsiteFeature3", {
            fallback: "SEO-ready setup",
          }),
        },
      ],
    },
    {
      slug: "web-application-for-booking-system",
      titleFallback: t("webApplicationForBookingSystemTitle", {
        fallback: "Web Application for Booking System",
      }),
      overviewFallback: t("webApplicationForBookingSystemOverview", {
        fallback:
          "A custom-built web application allowing users to manage bookings and sessions.",
      }),
      challengeFallback: t("webApplicationForBookingSystemChallenge", {
        fallback:
          "Developing a system that is easy to use while handling multiple interactions and user inputs.",
      }),
      solutionFallback: t("webApplicationForBookingSystemSolution", {
        fallback:
          "We created a structured backend with a simple front-end interface, making session management fast and flexible.",
      }),
      featureItems: [
        {
          fallback: t("webApplicationForBookingSystemFeature1", {
            fallback: "User-friendly dashboard",
          }),
        },
        {
          fallback: t("webApplicationForBookingSystemFeature2", {
            fallback: "Booking and scheduling system",
          }),
        },
        {
          fallback: t("webApplicationForBookingSystemFeature3", {
            fallback: "Data handling and logic",
          }),
        },
        {
          fallback: t("webApplicationForBookingSystemFeature4", {
            fallback: "Scalable architecture",
          }),
        },
      ],
    },
    {
      slug: "website-redesign-project",
      titleFallback: t("websiteRedesignProjectTitle", {
        fallback: "Website Redesign Project",
      }),
      overviewFallback: t("websiteRedesignProjectOverview", {
        fallback:
          "A complete redesign of an outdated website that lacked structure and performance.",
      }),
      challengeFallback: t("websiteRedesignProjectChallenge", {
        fallback:
          "Improving usability and modernising the visual experience without losing existing content.",
      }),
      solutionFallback: t("websiteRedesignProjectSolution", {
        fallback:
          "We rebuilt the website with a new structure, improved navigation, and optimized performance.",
      }),
      featureItems: [
        {
          fallback: t("websiteRedesignProjectFeature1", {
            fallback: "Modern UI/UX redesign",
          }),
        },
        {
          fallback: t("websiteRedesignProjectFeature2", {
            fallback: "Improved site structure",
          }),
        },
        {
          fallback: t("websiteRedesignProjectFeature3", {
            fallback: "Faster loading speed",
          }),
        },
        {
          fallback: t("websiteRedesignProjectFeature4", {
            fallback: "Responsive rebuild",
          }),
        },
      ],
    },
    {
      slug: "high-performance-landing-page",
      titleFallback: t("highPerformanceLandingPageTitle", {
        fallback: "High-Performance Landing Page",
      }),
      overviewFallback: t("highPerformanceLandingPageOverview", {
        fallback:
          "A single-page solution designed to clearly present an idea and guide user action.",
      }),
      challengeFallback: t("highPerformanceLandingPageChallenge", {
        fallback:
          "Keeping the page simple while making it engaging and effective.",
      }),
      solutionFallback: t("highPerformanceLandingPageSolution", {
        fallback:
          "We focused on clarity, structured content, and smooth interaction to guide users naturally.",
      }),
      featureItems: [
        {
          fallback: t("highPerformanceLandingPageFeature1", {
            fallback: "Conversion-focused design",
          }),
        },
        {
          fallback: t("highPerformanceLandingPageFeature2", {
            fallback: "Clear content flow",
          }),
        },
        {
          fallback: t("highPerformanceLandingPageFeature3", {
            fallback: "Fast and lightweight structure",
          }),
        },
        {
          fallback: t("highPerformanceLandingPageFeature4", {
            fallback: "Responsive layout",
          }),
        },
      ],
    },
  ];
};
