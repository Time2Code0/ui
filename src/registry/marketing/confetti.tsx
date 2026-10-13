"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import confetti, {
  type CreateTypes as ConfettiInstance,
  type Options as ConfettiOptions,
  type GlobalOptions as GlobalConfettiOptions,
} from "canvas-confetti";

interface ConfettiApi {
  fire: (options?: ConfettiOptions) => void;
}

const ConfettiContext = createContext<ConfettiApi | undefined>(undefined);

const DEFAULT_GLOBAL_OPTIONS: GlobalConfettiOptions = { resize: true };

function Confetti({
  ref,
  children,
  manualStart = false,
  options,
  globalOptions = DEFAULT_GLOBAL_OPTIONS,
  ...props
}: Omit<React.ComponentPropsWithRef<"canvas">, "ref"> & {
  ref: React.Ref<ConfettiApi> | undefined;
  manualStart?: boolean;
  options?: ConfettiOptions;
  globalOptions?: GlobalConfettiOptions;
}) {
  const instanceRef = useRef<ConfettiInstance | null>(null); // confetti instance

  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node === null) {
        // <canvas> is unmounted => reset and destroy instanceRef
        instanceRef.current?.reset();
        instanceRef.current = null;
      } else {
        // <canvas> is mounted => create the confetti instance (if not already created)
        if (instanceRef.current) {
          return;
        }

        instanceRef.current = confetti.create(node, globalOptions);
      }
    },
    [globalOptions]
  );

  // `fire` is a function that call the instance() with `opts` merged with `options`
  const fire = useCallback(
    (opts = {}) => {
      const instance = instanceRef.current;

      if (!instance) {
        return;
      }

      instance({
        ...options,
        ...opts,
      })?.catch((err: unknown) => {
        console.error(err);
      });
    },
    [options]
  );

  const api = useMemo(
    () => ({
      fire,
    }),
    [fire]
  );

  // attach `api` object to the forwarded ref
  useImperativeHandle(ref, () => api, [api]);

  // autofire unless manualStart is set to true
  useEffect(() => {
    if (!manualStart) {
      fire();
    }
  }, [manualStart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...props} />
      {children}
    </ConfettiContext.Provider>
  );
}

const useConfetti = () => {
  const context = useContext(ConfettiContext);

  if (!context) {
    throw new Error("useConfetti must be used within <Confetti />");
  }

  return context;
};

const shapeFromText = (options: {
  text: string;
  scalar?: number;
  color?: string;
  fontFamily?: string;
}) => confetti.shapeFromText({ ...options });

const shapeFromPath = (options: { path: string; matrix?: DOMMatrix }) =>
  confetti.shapeFromPath({ ...options });

export type { ConfettiApi };
export { Confetti, shapeFromPath, shapeFromText, useConfetti };
