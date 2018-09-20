import { Option, None, Some } from "safe-types";
import { reqIdleCb, cancelIdleCb } from "./shims/request-idle-callback";
import { identity } from "safe-types/lib/utils";

export {
  reqIdleCb,
  cancelIdleCb,
  CancelIdleCallback,
  IdleDeadline,
  RequestIdleCallback,
} from "./shims/request-idle-callback";

/**
 * Construct an `IdleValue` of type `T` with a function that creates & returns
 * the value, `T`. It will be enqueued to run when the browser is idle, but if
 * accessed before it's created, it will cancel the callback and run the
 * function immediately.
 */
export class IdleValue<T> {
  private option: Option<T> = None();
  private handle: Option<number>;

  constructor(private factory: () => T) {
    this.handle = Some(
      reqIdleCb(() => {
        this.option = Some(this.factory());
      })
    );
  }

  private cancelIdleCb(): void {
    this.handle = this.handle.and_then<number>(handle => {
      cancelIdleCb(handle);
      return None();
    });
  }

  get value(): T {
    return this.option.match({
      Some: identity,
      None: () => {
        this.cancelIdleCb();

        const value = this.factory();
        this.option = Some(value);

        return value;
      },
    });
  }

  set value(new_value: T) {
    this.cancelIdleCb();
    this.option = Some(new_value);
  }
}
