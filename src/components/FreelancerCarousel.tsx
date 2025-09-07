import { FreelancerSearchResult } from '@/hooks/useFreelancerSearch';
import FreelancerCard from '@/components/FreelancerCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface FreelancerCarouselProps {
  freelancers: FreelancerSearchResult[];
}

const FreelancerCarousel = ({ freelancers }: FreelancerCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {freelancers.map((freelancer) => (
          <CarouselItem 
            key={freelancer.id} 
            className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3"
          >
            <FreelancerCard freelancer={freelancer} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

export default FreelancerCarousel;