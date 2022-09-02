import type { Ref } from "vue";
import { ref } from "vue";
import type { InventoryDto } from "@/interfaces/inventory";

export const useConvertExpirationDate = (inventories: Ref<InventoryDto[]>) => {
  const newInventories: Ref<InventoryDto[]> = ref([]);

  inventories.value.forEach((value) => {
    const inventoryObj = { ...value };

    inventoryObj.expirationDate = new Date(
      inventoryObj.expirationDate
    ).toDateString();

    newInventories.value.push(inventoryObj);
  });

  return newInventories;
};
