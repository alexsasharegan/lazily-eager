# lazily-eager

An abstraction around creating values during `requestIdleCallback`.

This is my own implementation of Philip Walton's _**Idle Until Urgent**_ pattern
described in his
[September 2018 blog post, "Idle Until Urgent"](https://philipwalton.com/articles/idle-until-urgent/).
The post outlines the benefits of utilizing the browser's `requestIdleCallback`
function to create values that you don't need right away. It also describes the
behavior that lazily created values should be able to be accessed when needed,
and return synchronously. This can be implemented by intercepting accessors and
cancelling the `requestIdleCallback` if enqueued.

For a more in depth explanation, visit
[the article](https://philipwalton.com/articles/idle-until-urgent/). The section
[_Code Evaluation Strategies_](https://philipwalton.com/articles/idle-until-urgent/#code-evaluation-strategies)
explains the context for this pattern as well as the reasons why lazy/eager
evaluation doesn't handle all use cases.

This implementation uses ES5 Object getters and setters make the API a little
more ergonomic. Consider this modified example from Philip Walton's article:

```js
import { IdleValue } from "./path/to/IdleValue.mjs";

class MyComponent {
  constructor() {
    addEventListener("click", () => this.handleUserClick());

    this.formatter = new IdleValue(() => {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
      });
    });
  }

  handleUserClick() {
    console.log(this.formatter.getValue().format(new Date()));
    this.formatter.setValue(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Phoenix",
      })
    );
  }
}
```

The only difference in the api is that getters and setters are not functions.
Instead, they behave like normal object properties.

```js
import { IdleValue } from "lazily-eager";

class MyComponent {
  constructor() {
    addEventListener("click", () => this.handleUserClick());

    this.formatter = new IdleValue(() => {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
      });
    });
  }

  handleUserClick() {
    console.log(this.formatter.value.format(new Date()));
    this.formatter.value = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Phoenix",
    });
  }
}
```

Besides this minor difference, this implementation is written in TypeScript, and
as such ships with definition files to provide intellisense.
