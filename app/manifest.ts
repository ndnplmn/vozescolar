import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VozEscolar — CETIS 52 Hermenegildo Galeana",
    short_name: "VozEscolar",
    description: "Buzón oficial confidencial para reportar situaciones en el CETIS 52.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#76082c",
    categories: ["education", "utilities"],
    icons: [
      {
        src: "/cetis52-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
