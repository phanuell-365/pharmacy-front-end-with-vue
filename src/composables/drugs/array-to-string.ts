import { ref } from "vue";

export const useArrayToString = (arr: string[] | undefined) => {
  const refArr = ref(arr);

  const arrString = ref(refArr.value?.toString());

  const arrStringChunks = ref(arrString.value?.split(","));

  return ref(arrStringChunks.value?.join(", "));
};
