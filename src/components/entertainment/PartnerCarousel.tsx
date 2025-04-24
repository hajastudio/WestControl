
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PARTNERS = [
  { name: "Watch TV", logo: "/images/watchtv-logo.png" },
  { name: "Paramount+", logo: "/images/paramount-logo.png" },
  { name: "Telecine", logo: "/images/telecine-logo.png" },
  { name: "Warner", logo: "/images/warner-logo.png" },
  { name: "Premiere", logo: "/images/premiere-logo.png" },
  { name: "MTV", logo: "/images/mtv-logo.png" },
  { name: "Nick Jr", logo: "/images/nickjr-logo.png" },
  { name: "NSports", logo: "/images/nsports-logo.png" },
];

export function PartnerCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-3xl mx-auto"
    >
      <CarouselContent>
        {PARTNERS.map((partner, index) => (
          <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
            <div className="p-2">
              <div className="rounded-lg bg-white/80 p-4 h-24 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
