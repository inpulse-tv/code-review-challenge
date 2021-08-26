export interface IProps {
  className?: string;
  onTimeChange: (time: number) => {} | void;
  timerStart?: number;
  autoReload?: boolean;
  endText: string;
}
