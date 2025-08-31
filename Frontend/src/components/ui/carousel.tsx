import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext<{
  currentSlide: number
  totalSlides: number
  setCurrentSlide: (slide: number) => void
  nextSlide: () => void
  prevSlide: () => void
} | null>(null)

const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider")
  }
  return context
}

interface CarouselProps {
  children: React.ReactNode
  className?: string
  autoPlay?: boolean
  interval?: number
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ children, className, autoPlay = true, interval = 5000 }, ref) => {
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [isPlaying, setIsPlaying] = React.useState(autoPlay)
    const totalSlides = React.Children.count(children)

    const nextSlide = React.useCallback(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, [totalSlides])

    const prevSlide = React.useCallback(() => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }, [totalSlides])

    React.useEffect(() => {
      if (!isPlaying) return

      const timer = setInterval(() => {
        nextSlide()
      }, interval)

      return () => clearInterval(timer)
    }, [isPlaying, interval, nextSlide])

    const pauseAutoPlay = () => setIsPlaying(false)
    const resumeAutoPlay = () => setIsPlaying(true)

    return (
      <CarouselContext.Provider
        value={{
          currentSlide,
          totalSlides,
          setCurrentSlide,
          nextSlide,
          prevSlide,
        }}
      >
        <div
          ref={ref}
          className={cn("relative overflow-hidden", className)}
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentSlide, totalSlides } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn("flex transition-transform duration-500 ease-in-out", className)}
      style={{
        transform: `translateX(-${currentSlide * 100}%)`,
      }}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-shrink-0 w-full", className)}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { prevSlide } = useCarousel()

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90",
        className
      )}
      onClick={prevSlide}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { nextSlide } = useCarousel()

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90",
        className
      )}
      onClick={nextSlide}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

const CarouselIndicators = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentSlide, totalSlides, setCurrentSlide } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2", className)}
      {...props}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            currentSlide === index
              ? "bg-brand-primary"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          )}
          onClick={() => setCurrentSlide(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
})
CarouselIndicators.displayName = "CarouselIndicators"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
}
