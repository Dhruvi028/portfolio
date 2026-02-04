"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type CarouselProps = {
    children: React.ReactNode;
    className?: string;
};

export function Carousel({ children, className }: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: true,
        skipSnaps: false,
        slidesToScroll: 1,
    });

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const onInit = useCallback((emblaApi: any) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);

        return () => {
            emblaApi.off('reInit', onInit);
            emblaApi.off('reInit', onSelect);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onInit, onSelect]);

    return (
        <div className={cn('relative', className)}>
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                    {children}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollPrev}
                    disabled={prevBtnDisabled}
                    className={cn(
                        "h-12 w-12 rounded-full border-2 transition-all duration-300",
                        "bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm",
                        "hover:from-primary/20 hover:to-secondary/20 hover:scale-110 hover:shadow-lg hover:shadow-primary/20",
                        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    )}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                {/* Pagination Dots */}
                <div className="flex gap-2">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={cn(
                                "transition-all duration-300 rounded-full",
                                "hover:scale-125",
                                index === selectedIndex
                                    ? "w-8 h-3 bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/30"
                                    : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollNext}
                    disabled={nextBtnDisabled}
                    className={cn(
                        "h-12 w-12 rounded-full border-2 transition-all duration-300",
                        "bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm",
                        "hover:from-primary/20 hover:to-secondary/20 hover:scale-110 hover:shadow-lg hover:shadow-primary/20",
                        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    )}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
