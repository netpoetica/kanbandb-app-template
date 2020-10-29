import React from "react";

import { defaultCategoryColors } from "../../config";
import { CategoryOption } from "../../types";
import styles from "./CategorySelect.module.scss";

export type Props = {
  value?: CategoryOption["label"];
  onChange: (categoryOption: CategoryOption) => void;
};

export default function CategorySelect({
  value,
  onChange,
}: Props): React.ReactElement {
  const selectedCategory = defaultCategoryColors.find((x) => x.label === value);
  return (
    <select
      data-testid="categorySelect"
      value={selectedCategory?.label}
      className={styles.categorySelect}
      style={
        (selectedCategory && { color: selectedCategory.color }) || undefined
      }
      onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
        const find = defaultCategoryColors.find(
          (x) => x.label === event.target.value
        );
        if (find) {
          onChange(find);
        }
      }}
    >
      {defaultCategoryColors.map((x, index) => (
        <option
          data-testid="categoryOption"
          key={index}
          style={{ color: x.color }}
          value={x.label}
        >
          {x.label}
        </option>
      ))}
    </select>
  );
}

CategorySelect.defaultProps = {
  value: defaultCategoryColors[0].label,
};
