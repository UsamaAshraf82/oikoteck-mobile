export const stringify_area_district = ({
  district,
  area_1,
  area_2,
  placeholder = '',
}: {
  district?: string | null;
  area_1?: string | null;
  area_2?: string | null;
  placeholder?: string;
}) => {
  if (district) {
    if (area_2 && area_1) {
      return `${area_2}, ${area_1}, ${district}`;
    }
    if (area_2) {
      return `${area_2}, ${district}`;
    }
    if (area_1) {
      return `${area_1}, ${district}`;
    } else {
      return district;
    }
  } else {
    if (area_2 && area_1) {
      return `${area_2}, ${area_1}`;
    }
    if (area_2) {
      return area_2;
    }
    if (area_1) {
      return area_1;
    }
  }
  return placeholder;
};
