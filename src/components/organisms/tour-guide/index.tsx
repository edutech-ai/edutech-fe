"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import "./tour-guide.css";

// Types
export interface TourStep {
  target: string; // CSS selector với data-tour="..." (empty = centered)
  title: string;
  description: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  highlight?: boolean; // Nhấn mạnh step này quan trọng
  onEnter?: () => void; // Callback khi vào step này
  clickTarget?: boolean; // Tự động click vào target element
}

interface TourGuideProps {
  steps: TourStep[];
  storageKey?: string;
  onComplete?: () => void;
  autoStart?: boolean;
  autoStartDelay?: number;
}

interface TourContextValue {
  isOpen: boolean;
  currentStep: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourGuide");
  }
  return context;
};

// Tính toán vị trí tooltip
const calculatePosition = (
  targetRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TourStep["placement"] = "bottom",
  isMobile: boolean
) => {
  const padding = 12;
  const arrowSize = 8;
  let top = 0;
  let left = 0;

  // Trên mobile, ưu tiên hiển thị ở bottom hoặc top
  const effectivePlacement = isMobile ? "bottom" : placement;

  switch (effectivePlacement) {
    case "top":
      top = targetRect.top - tooltipRect.height - padding - arrowSize;
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      break;
    case "bottom":
      top = targetRect.bottom + padding + arrowSize;
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      left = targetRect.left - tooltipRect.width - padding - arrowSize;
      break;
    case "right":
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      left = targetRect.right + padding + arrowSize;
      break;
  }

  // Giữ tooltip trong viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < padding) left = padding;
  if (left + tooltipRect.width > viewportWidth - padding) {
    left = viewportWidth - tooltipRect.width - padding;
  }
  if (top < padding) top = padding;
  if (top + tooltipRect.height > viewportHeight - padding) {
    top = viewportHeight - tooltipRect.height - padding;
  }

  return { top, left, placement: effectivePlacement };
};

// Main Component
export const TourGuide: React.FC<TourGuideProps> = ({
  steps,
  storageKey = "tour-completed",
  onComplete,
  autoStart = true,
  autoStartDelay = 1000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] =
    useState<TourStep["placement"]>("bottom");
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentStepData = steps[currentStep];

  // Check mount status for portal
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Update tooltip position
  const updatePosition = useCallback(() => {
    if (!isOpen || !currentStepData) return;

    const tooltipElement = tooltipRef.current;
    if (!tooltipElement) return;

    // If no target, center the tooltip
    if (!currentStepData.target) {
      const tooltipRect = tooltipElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      setTooltipPosition({
        top: (viewportHeight - tooltipRect.height) / 2,
        left: (viewportWidth - tooltipRect.width) / 2,
      });
      setActualPlacement(undefined);
      return;
    }

    const targetElement = document.querySelector(
      `[data-tour="${currentStepData.target}"]`
    );

    if (!targetElement) return;

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();

    const { top, left, placement } = calculatePosition(
      targetRect,
      tooltipRect,
      currentStepData.placement,
      isMobile
    );

    setTooltipPosition({ top, left });
    setActualPlacement(placement);

    // Scroll element vào view nếu cần
    const isInView =
      targetRect.top >= 0 &&
      targetRect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight);

    if (!isInView) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isOpen, currentStepData, isMobile]);

  // Update position khi step thay đổi hoặc resize
  useEffect(() => {
    if (!isOpen) return;

    // Delay để DOM render
    const timer = setTimeout(updatePosition, 100);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, currentStep, updatePosition]);

  // Handle step callbacks (onEnter, clickTarget)
  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    // Call onEnter callback
    if (currentStepData.onEnter) {
      const timer = setTimeout(() => {
        currentStepData.onEnter?.();
      }, 150);
      return () => clearTimeout(timer);
    }

    // Auto click target if clickTarget is true
    if (currentStepData.clickTarget && currentStepData.target) {
      const timer = setTimeout(() => {
        const element = document.querySelector(
          `[data-tour="${currentStepData.target}"]`
        ) as HTMLElement;
        if (element) {
          element.click();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep, currentStepData]);

  // Auto start tour
  useEffect(() => {
    if (!autoStart) return;

    const hasCompleted = localStorage.getItem(storageKey);
    if (hasCompleted) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, autoStartDelay);

    return () => clearTimeout(timer);
  }, [autoStart, autoStartDelay, storageKey]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const endTour = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(storageKey, "true");
    onComplete?.();
  }, [storageKey, onComplete]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, steps.length, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(storageKey);
    setCurrentStep(0);
    setIsOpen(true);
  }, [storageKey]);

  const contextValue: TourContextValue = {
    isOpen,
    currentStep,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
  };

  if (!mounted) return null;

  // Get target element for highlight (only if target is specified)
  const hasTarget = currentStepData?.target;
  const targetSelector = hasTarget
    ? `[data-tour="${currentStepData.target}"]`
    : null;
  const targetElement = targetSelector
    ? document.querySelector(targetSelector)
    : null;
  const targetRect = targetElement?.getBoundingClientRect();

  return (
    <TourContext.Provider value={contextValue}>
      {/* Help Button - Luôn hiển thị */}
      <Button
        variant="default"
        size="icon"
        onClick={resetTour}
        className="tour-help-button fixed z-999 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        style={{
          bottom: isMobile ? "80px" : "24px",
          right: isMobile ? "16px" : "24px",
          width: isMobile ? "44px" : "48px",
          height: isMobile ? "44px" : "48px",
        }}
        title="Xem lại hướng dẫn"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* Tour Overlay & Tooltip */}
      {isOpen &&
        currentStepData &&
        createPortal(
          <>
            {/* Overlay với highlight */}
            <div className="tour-overlay" onClick={endTour}>
              {targetRect && (
                <div
                  className="tour-spotlight"
                  style={{
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                  }}
                />
              )}
            </div>

            {/* Tooltip */}
            <div
              ref={tooltipRef}
              className={cn(
                "tour-tooltip",
                actualPlacement && `tour-tooltip-${actualPlacement}`,
                !hasTarget && "tour-tooltip-center",
                currentStepData.highlight && "tour-tooltip-highlight"
              )}
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              {/* Close button */}
              <button
                onClick={endTour}
                className="tour-close-btn"
                aria-label="Đóng hướng dẫn"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Badge quan trọng */}
              {currentStepData.highlight && (
                <span className="tour-highlight-badge">Quan trọng</span>
              )}

              {/* Content */}
              <h3 className="tour-title">{currentStepData.title}</h3>
              <div className="tour-description">
                {currentStepData.description}
              </div>

              {/* Progress & Navigation */}
              <div className="tour-footer">
                <span className="tour-progress">
                  {currentStep + 1} / {steps.length}
                </span>

                <div className="tour-nav">
                  {currentStep > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevStep}
                      className="tour-btn-prev"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Quay lại
                    </Button>
                  )}

                  <Button
                    variant="default"
                    size="sm"
                    onClick={nextStep}
                    className="tour-btn-next"
                  >
                    {currentStep === steps.length - 1 ? (
                      "Hoàn thành"
                    ) : (
                      <>
                        Tiếp tục
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </TourContext.Provider>
  );
};

export default TourGuide;
