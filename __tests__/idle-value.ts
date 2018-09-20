import { IdleValue } from "../src/index";

describe("IdleValue", async () => {
  it("should work", async () => {
    let formatter = new IdleValue(
      () =>
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Phoenix",
        })
    );

    await new Promise(r => setTimeout(r, 50));

    expect(formatter.value.format(0)).toMatchSnapshot();

    formatter.value = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
    });
    expect(formatter.value.format(0)).toMatchSnapshot();

    formatter = new IdleValue(
      () =>
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Phoenix",
        })
    );
    expect(formatter.value.format(0)).toMatchSnapshot();
  });
});
