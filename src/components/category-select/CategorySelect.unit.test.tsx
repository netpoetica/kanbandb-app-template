import React from "react";
import { fireEvent, render } from "@testing-library/react";

import { defaultCategoryColors } from "../../config";
import CategorySelect, {
  renderOptions,
  onSelectChange,
} from "./CategorySelect";

describe("components/CardSelect", () => {
  it("should render a category select", () => {
    const { getByTestId } = render(
      <CategorySelect onChange={jest.fn()} value="bug" />
    );
    const element = getByTestId("categorySelect");
    expect(element).toBeInTheDocument();
  });

  it("should render options and be based on a config", () => {
    const { getAllByTestId } = render(
      <CategorySelect onChange={jest.fn()} value="bug" />
    );
    const elements = getAllByTestId("categoryOption");
    expect(elements.length).toBe(defaultCategoryColors.length);
    Array.from(elements).forEach((element, index) => {
      expect(element).toHaveTextContent(defaultCategoryColors[index].label);
      expect(element).toHaveStyle({
        color: defaultCategoryColors[index].color,
      });
    });
  });

  it("should call a callback upon value change", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <CategorySelect onChange={onChange} value="bug" />
    );
    const element = getByTestId("categorySelect");
    fireEvent.change(element, {
      target: { value: defaultCategoryColors[3].label },
    });
    expect(onChange).toHaveBeenCalledWith(defaultCategoryColors[3]);
  });

  it("should render options properly", async () => {
    const { findAllByTestId } = render(<>{renderOptions()}</>);
    const options = (await findAllByTestId(
      "categoryOption"
    )) as HTMLOptionElement[];
    expect(options.length).toBe(defaultCategoryColors.length);
    options.forEach((opts, index) => {
      expect(opts.value).toBe(defaultCategoryColors[index].label);
      expect(opts.style.color).toBe(defaultCategoryColors[index].color);
      expect(opts).toHaveTextContent(defaultCategoryColors[index].label);
    });
  });

  it("should select the proper value for onChange callback", () => {
    const onChange = jest.fn();
    const method = onSelectChange(onChange, defaultCategoryColors);
    method({
      target: {
        value: defaultCategoryColors[1].label,
      },
    } as React.ChangeEvent<HTMLSelectElement>);
    expect(onChange).toBeCalledWith(defaultCategoryColors[1]);
  });
});
