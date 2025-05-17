
import React from "react";

interface BrandImageProps {
  src: string;
  alt: string;
  website: string;
}

const brands: BrandImageProps[] = [
  {
    src: "/lovable-uploads/b0ae38c2-e241-450d-82b0-1e95aeb4ba57.png",
    alt: "ABB",
    website: "https://new.abb.com/fr"
  },
  {
    src: "/lovable-uploads/018c9868-b1ad-4716-9f0b-b4f2a238fed8.png",
    alt: "Hager",
    website: "https://www.hager.fr"
  },
  {
    src: "/lovable-uploads/39c84754-472b-48b6-8339-5e58e0e39693.png",
    alt: "Legrand",
    website: "https://www.legrand.fr"
  },
  {
    src: "/lovable-uploads/36aface9-8d15-4c4e-a7c1-51cda2dbba8e.png",
    alt: "Schneider Electric",
    website: "https://www.se.com/fr"
  }
];

const BrandCarousel: React.FC = () => {
  const handleBrandClick = (website: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(website, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-16 bg-gradient-to-b from-black/30 via-black/20 to-black/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-cme-gold via-white to-cme-gold bg-clip-text text-transparent">
            Mes marques de confiance
          </span>
        </h2>

        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent pointer-events-none z-10"></div>

          <div className="carousel-wrapper">
            <div className="carousel-content">
              {[...Array(3)].map((_, groupIndex) => (
                <div key={`group-${groupIndex}`} className="brand-group">
                  {brands.map((brand, index) => (
                    <a
                      key={`brand-${groupIndex}-${index}`}
                      href={brand.website}
                      onClick={handleBrandClick(brand.website)}
                      className="brand-item flex-shrink-0 w-36 md:w-44 h-20 md:h-24 mx-3
                               flex items-center justify-center
                               bg-gradient-to-br from-white/10 to-white/5
                               rounded-2xl border border-white/10
                               transition-transform duration-200
                               hover:scale-105 active:scale-95"
                      title={`Visiter le site de ${brand.alt}`}
                    >
                      <img
                        src={brand.src}
                        alt={brand.alt}
                        className="max-w-full max-h-full object-contain 
                                 filter brightness-0 invert opacity-90"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-white/60 mt-8 max-w-2xl mx-auto">
          Je travaille exclusivement avec des marques reconnues pour leur fiabilité et leur qualité.
          Cliquez sur un logo pour visiter leur site officiel.
        </p>
      </div>

      <style>
        {`
        .carousel-wrapper {
          overflow: hidden;
          padding: 1.5rem 0;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        .carousel-content {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }

        .brand-group {
          display: flex;
          flex-shrink: 0;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        `}
      </style>
    </section>
  );
};

export default BrandCarousel;
