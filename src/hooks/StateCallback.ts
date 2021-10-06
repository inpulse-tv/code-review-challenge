import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Allow using callback on React useState hook.
 * @param initialState current state.
 * @returns the current state with callback to execute.
 */
const useStateCallback = <T>(
  initialState: T | (() => T)
): [T, (state: T, cb?: any) => void] => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<any>(null);

  const setStateCallback = useCallback((state: T, cb: any) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
};

export default useStateCallback;
