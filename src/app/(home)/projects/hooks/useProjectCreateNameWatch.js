import { useEffect } from "react";
import slugify from "slugify";

export const useProjectCreateNameWatch = (form) => {
  const nameValue = form.watch("name");

  useEffect(() => {
    form.setValue(
      "slug",
      slugify(nameValue, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue, form.setValue]);
};
