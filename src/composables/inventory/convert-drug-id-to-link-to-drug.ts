import type { Ref } from "vue";
import { ref } from "vue";
import type { InventoryDto } from "@/interfaces/inventory";
import { useDrugsStore } from "@/stores/app/drugs";

export const useConvertDrugIdToLinkDrug = async (
  inventories: Ref<InventoryDto[]>
) => {
  const newInventories: Ref<InventoryDto[]> = ref([]);

  const drugsStore = useDrugsStore();

  for (const value of inventories.value) {
    const inventoryObj = { ...value };

    const drug = await drugsStore.loadDrugById(inventoryObj.DrugId);

    inventoryObj.DrugId = drug.name;

    newInventories.value.push(inventoryObj);
  }

  return newInventories;
};
