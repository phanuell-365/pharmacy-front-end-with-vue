import { ref } from "vue";

export const useExtractFormData = (
  form: HTMLFormElement,
  attributes: string[]
) => {
  const elements: HTMLCollection = form.getElementsByClassName("class-input");

  const attrs = ref(attributes);

  const payload = ref({});

  attrs.value.forEach((attributeName) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    payload.value[attributeName] = elements.namedItem(attributeName).value;
  });

  return payload;
};
