import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Hello from "../src";

Enzyme.configure({ adapter: new Adapter() });

describe("Test starter kit", () => {
  it("Hello is equal to 'World'", () => {
    expect(Hello).toEqual("World");
  });
});
