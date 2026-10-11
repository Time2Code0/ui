"use client";

import type { UseEmblaCarouselType } from "embla-carousel-react";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";
import useEmblaCarousel from "embla-carousel-react";

import { Button } from "./button";
import { Icon } from "./icon";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameter = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameter[0];
type CarouselPlugin = UseCarouselParameter[1];

interface UseDotButtonType {
  onDotButtonClick: (index: number) => void;
  scrollSnaps: number[];
  selectedIndex: number;
}

interface CarouselProps {
  opts?: CarouselOptions;
  orientation?: "horizontal" | "vertical";
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps &
  UseDotButtonType;

const CarouselContext = createContext<CarouselContextProps | undefined>(
  undefined
);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within <Carousel />");
  }

  return context;
}

const useDotButton = (emblaApi: CarouselApi | undefined): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) {
        return;
      }

      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    onDotButtonClick,
    scrollSnaps,
    selectedIndex,
  };
};

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) {
      return;
    }

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  useEffect(() => {
    if (!(api && setApi)) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        api,
        canScrollNext,
        canScrollPrev,
        carouselRef,
        onDotButtonClick,
        opts,
        orientation,
        scrollNext,
        scrollPrev,
        scrollSnaps,
        selectedIndex,
      }}
    >
      <section
        aria-roledescription="carousel"
        className={cn("relative", className)}
        onKeyDownCapture={handleKeyDown}
        role="region"
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  containerClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { containerClassName?: string }) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      className={cn("overflow-hidden", containerClassName)}
      ref={carouselRef}
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({
  className,
  ...props
}: React.ComponentPropsWithRef<"fieldset">) {
  const { orientation } = useCarousel();

  return (
    <fieldset
      aria-roledescription="slide"
      className={cn(
        "m-0 min-w-0 shrink-0 grow-0 basis-full border-0 p-0",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-lg",
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      className={cn(
        "absolute size-8",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-y-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      shape="full"
      size={size}
      variant={variant}
      {...props}
    >
      <Icon className="size-4" icon={ArrowLeft01Icon} />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-lg",
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      className={cn(
        "absolute size-8",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-y-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      shape="full"
      size={size}
      variant={variant}
      {...props}
    >
      <Icon className="size-4" icon={ArrowRight01Icon} />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

function CarouselIndicator({
  containerClassName,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { containerClassName?: string }) {
  const { scrollSnaps, selectedIndex, onDotButtonClick } = useCarousel();

  if (!scrollSnaps.length) {
    return null;
  }

  return (
    <div className={cn("flex gap-3", containerClassName)} {...props}>
      {scrollSnaps.map((scrollSnap, index) => (
        <button
          aria-label={`Slide - ${index}`}
          className={cn(
            "size-2.5 cursor-pointer rounded-full border border-foreground data-[state=active]:bg-foreground",
            className
          )}
          data-state={index === selectedIndex ? "active" : "inactive"}
          key={scrollSnap}
          onClick={() => {
            onDotButtonClick(index);
          }}
          type="button"
        />
      ))}
    </div>
  );
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useDotButton,
};
