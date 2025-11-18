import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title = "Alessandro Karatê e Kobudo - Palmital SP",
  description = "Tradição Shorin-Ryu em Palmital. Mais que um dojo, uma família dedicada à formação integral através do karatê tradicional. Disciplina, respeito e excelência.",
  keywords = "karate, kobudo, shorin-ryu, palmital, artes marciais, dojo, alessandro, karatê tradicional",
  image = "/logo.png",
  url = "https://alessandrokarate.com.br",
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords);

    // Open Graph / Facebook
    updateProperty("og:type", "website");
    updateProperty("og:url", url);
    updateProperty("og:title", title);
    updateProperty("og:description", description);
    updateProperty("og:image", image);

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:url", url);
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);
  }, [title, description, keywords, image, url]);

  return null;
};
