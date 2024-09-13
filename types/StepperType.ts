export interface StepperType {
  next: () => void;
  prev: () => void;
  reset: () => void;
  isFirst: boolean;
  isLast: boolean;
}