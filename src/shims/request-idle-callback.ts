export interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

export type RequestIdleCallback = (
  fn: (deadline: IdleDeadline) => any
) => number;

export type CancelIdleCallback = (handle: number) => void;

class $IdleDeadline implements IdleDeadline {
  private init_timestamp = performance.now();

  get didTimeout(): boolean {
    return false;
  }

  timeRemaining(): number {
    return Math.max(0, 50 - (performance.now() - this.init_timestamp));
  }
}

// @ts-ignore
const hasBuiltIn = typeof requestIdleCallback === "function";

const $requestIdleCallback: RequestIdleCallback = op => {
  const deadline = new $IdleDeadline();
  return window.setTimeout(() => op(deadline), 0);
};

const $cancelIdleCallback: CancelIdleCallback = handle => {
  window.clearTimeout(handle);
};

let reqIdleCb: RequestIdleCallback = $requestIdleCallback;
if (hasBuiltIn) {
  // @ts-ignore
  reqIdleCb = requestIdleCallback;
}

let cancelIdleCb: CancelIdleCallback = $cancelIdleCallback;
if (hasBuiltIn) {
  // @ts-ignore
  cancelIdleCb = cancelIdleCallback;
}

export { reqIdleCb, cancelIdleCb };
