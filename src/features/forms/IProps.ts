import { IValues } from "./IValues";

export interface IProps {
  onSubmit: (values: IValues) => {} | void;
  onEscapePress?: () => {} | void;
}
