import { useEffect } from "react";
import slugify from "slugify";

export default function useProjectEditFormWatch(form) {
  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (!nameValue) return;

    form.setValue(
      "slug",
      slugify(nameValue, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      }),
    );
  }, [nameValue, form.setValue]);

  return { slugValue };
}
