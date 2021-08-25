export interface IProps {
    className?: string;
    maxIndex: number;
    startIndex?: number;
    changeIndex?: boolean;
    onIndexChange: (index:number) => {} | void;
  }
