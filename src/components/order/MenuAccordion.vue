<template>
    <div class="card w-full">
        <Accordion multiple :value="activeAccordion">
            <AccordionPanel v-for="item in menuType" :key="item.value" :value="item.value">
                <AccordionHeader>
                    {{ item.label }}
                </AccordionHeader>
                <AccordionContent>
                    <MenuFieldset v-for="menus in item.menusByGroup" :menuByGroup="menus">

                    </MenuFieldset>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup>
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { reactive, ref, onMounted } from 'vue';
import MenuFieldset from './MenuFieldset.vue';
import { useAxiosStore } from '@/stores/axios';

const axiosStore = useAxiosStore();
const menuType = reactive([
    { label: 'Santapan Utama', value: '1', menusByGroup: [] },
    { label: "Minuman", value: '2', menusByGroup: [] },
    { label: "Pencuci Mulut", value: '3', menusByGroup: [] },
    { label: "Lain-lain", value: '0', menusByGroup: [] },
]);
const activeAccordion = ref(menuType.map((item) => item.value));
function getAllMenus() {
    const loading = axiosStore.loading.show();
    axiosStore.get('/api/menu/all/groupByType', { params: { activeOnly: true } })
        .then((response) => {
            const data = response.data;
            menuType[0].menusByGroup = groupingMenu(data.mainCourse);
            menuType[1].menusByGroup = groupingMenu(data.drinks);
            menuType[2].menusByGroup = groupingMenu(data.dessert);
            menuType[3].menusByGroup = groupingMenu(data.others);
        })
        .finally(() => {
            loading.hide();
        });
}
function groupingMenu(menus) {
    const groupedMenus = [];
    for (const menu of menus) {
        const menuGroup = menu.menuGroup?.name ?? 'Lain-lain';
        const existingGroup = groupedMenus.find((group) => group.name === menuGroup);
        if (existingGroup) {
            existingGroup.menus.push(menu);
        }
        else {
            groupedMenus.push({ name: menuGroup, menus: [menu] });
        }
    }
    return groupedMenus;
}
onMounted(() => {
    getAllMenus();
});
</script>

<style scoped></style>