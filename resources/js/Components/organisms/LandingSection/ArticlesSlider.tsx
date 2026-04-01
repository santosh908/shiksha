"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Container,
} from "@mantine/core";

export interface CardData {
  title: string;
  description: string;
  link: string;
  image: string;
}

const mockdata: CardData[] = [
  {
    title: "Programme",
    description: "...",
    link: "https://iskcondwarka.org/programs/",
    image: "https://iskcondwarka.org/wp-content/uploads/2022/02/Programme-441x294.jpg",
  },
  {
    title: "Sudama Seva",
    description: "...",
    link: "https://iskcondwarka.org/sudama-seva-donation/index.php",
    image: "https://iskcondwarka.org/wp-content/uploads/2021/12/chat-2.jpg",
  },
  {
    title: "Bhagavad Gita",
    description: "...",
    link: "https://iskcondwarka.org/donate-bhagavat-gita/index.html",
    image: "https://iskcondwarka.org/wp-content/uploads/2021/12/chat-1.jpg",
  },
  {
    title: "Prasadam Donation",
    description: "...",
    link: "https://iskcondwarka.org/janmashtami-prasadam/index.html",
    image: "https://iskcondwarka.org/wp-content/uploads/2021/12/Prasadam-Donation.jpg",
  },
];

interface InteractiveCardSliderProps {
  data?: CardData[];
  className?: string;
}

export const ArticlesSlider: React.FC<InteractiveCardSliderProps> = ({
  data = mockdata,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const visibleCards = Array.from({ length: cardsToShow }, (_, i) => {
    const index = (currentIndex + i) % data.length;
    return { ...data[index], key: index };
  });

  return (
    <Container size="xl" >
      <div className="text-center mb-12">
        <Badge variant="outline" className="px-6 py-2 mb-4 border-blue-300 text-blue-600">
          Articles
        </Badge>
        <h2 className="text-3xl font-semibold mb-2">Explore Our Spiritual Journey</h2>
        <Text color="dimmed" size="md" className="max-w-2xl mx-auto">
          ....
        </Text>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex gap-6 transition-transform duration-700 ease-in-out">
            {visibleCards.map((item) => (
              <Card
                key={item.key}
                shadow="sm"
                radius="md"
                withBorder
                className="flex-shrink-0 w-[calc(33.33%-1rem)] bg-white/50 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <Card.Section>
                  <Image
                    src={item.image}
                    alt={item.title}
                    height={200}
                    fit="cover"
                    className="transition-transform duration-700 hover:scale-105"
                  />
                </Card.Section>

                <div className="p-4 flex flex-col flex-1">
                  <Text  size="lg" className="hover:text-blue-600 transition-colors mb-2">
                    {item.title}
                  </Text>
                  <Text size="sm" color="dimmed" className="line-clamp-3 mb-4 flex-1">
                    {item.description}
                  </Text>
                  <Button
                    component="a"
                    href={item.link}
                    target="_blank"
                    variant="outline"
                    className="mt-auto hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Learn More <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 z-10"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex justify-center mt-6 gap-2">
          {data.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex ? "bg-blue-600 scale-110" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};
