<template>
    <div class="container mx-auto">
        <h3>TETAPAN MENU</h3>
    </div>
    <div class="flex flex-row-reverse">
        <div class="container mx-auto">
            <DataTable v-model:filters="tableFilters" :loading="tableLoading" :value="menus" sortable :paginator="true"
                :rows="10" :rowsPerPageOptions="[5, 10, 20]" filterDisplay="menu"
                :globalFilterFields="['name', 'description']">
                <template #header>
                    <div class="flex justify-between">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <div class="flex justify-between">
                            <IconField style="margin-right: .5rem">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="tableFilters['global'].value" placeholder="Kata Carian" />
                            </IconField>
                            <Button label="Tambah" icon="pi pi-plus" @click="addMenu" />
                        </div>
                    </div>
                </template>
                <template #empty> Tiada rekod di temui </template>
                <template #loading> Mendapatkan data, sila tunggu... </template>
                <Column header="No">
                    <template #body="{ index }">
                        {{ index + 1 }}
                    </template>
                </Column>
                <Column field="name" sortable header="Nama">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Carian Nama" />
                    </template>
                </Column>
                <Column field="description" header="Keterangan">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Carian Keterangan" />
                    </template>
                    <template #body="{ data }">
                        <span v-html="data.description"></span>
                    </template>
                </Column>
                <Column field="menuType" sortable header="Jeni Menu">
                    <template #body="{ data }">
                        <Tag :value="menuTypeConverter(data.menuType)"
                            :severity="menuTypeSeverityConverter(data.menuType)" />
                    </template>
                    <template #filter="{ filterModel }">
                        <Select v-model="filterModel.value" :options="menuTypes" placeholder="Pilih Satu" showClear>
                            <template #option="slotProps">
                                <Tag :value="menuTypeConverter(slotProps.option)"
                                    :severity="menuTypeSeverityConverter(slotProps.option)" />
                            </template>
                        </Select>
                    </template>
                </Column>
                <Column field="menuGroup.name" sortable header="Kumpulan Menu">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Carian Kumpulan Menu" />
                    </template>
                </Column>
                <Column field="menuStatus" sortable header="Status Menu">
                    <template #body="{ data }">
                        <Tag :value="menuStatusConverter(data.menuStatus)"
                            :severity="menuStatusSeverityConverter(data.menuStatus)" />
                    </template>
                    <template #filter="{ filterModel }">
                        <Select v-model="filterModel.value" :options="menuStatuses" placeholder="Select One" showClear>
                            <template #option="slotProps">
                                <Tag :value="menuStatusConverter(slotProps.option)"
                                    :severity="menuStatusSeverityConverter(slotProps.option)" />
                            </template>
                        </Select>
                    </template>
                </Column>
                <Column field="price" sortable header="Harga">
                    <template #body="{ data }">
                        {{ currencyFormatter(data.price) }}
                    </template>
                    <template #filter="{ filterModel }">
                        <InputNumber v-model="filterModel.value" mode="currency" currency="MYR" locale="my-MY" />
                    </template>
                </Column>
                <Column header="Tindakan">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" class="mr-2 p-button-rounded p-button-success"
                            @click="editMenu(data.id)" title="Sunting" />
                        <Button icon="pi pi-image" class="mr-2 p-button-rounded p-button-info"
                            @click="viewMenuImages(data)" title="Lihat Imej" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                            @click="deleteMenuConfirmation($event, data)" title="Padam" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <MenuDialog v-model:visible="showMenuDialog" @afterSave="getMenus" :menuId="menuToUpdateId" />
    <MenuImageGalery v-model:visible="visbleMenuImageGalery" :menu="menuForImageGalery" />
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import Button from 'primevue/button';
import { computed, onMounted, ref } from 'vue';
import { menuStatusConverter, menuTypeConverter, menuStatusSeverityConverter, menuTypeSeverityConverter } from '@/utils/enumConverter';
import { useAxiosStore } from '@/stores/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';
import Select from 'primevue/select';
import { menuTypes, menuStatuses } from '@/constants/menu';
import MenuDialog from '@/components/menu/MenuDialog.vue';
import { currencyFormatter } from '@/utils/formatter';
import MenuImageGalery from '@/components/menu/MenuImageGalery.vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

const breadcrumbStore = useBreadcrumbStore();
const axiosStore = useAxiosStore();
const toast = useToast();
const confirm = useConfirm();
breadcrumbStore.breadCrumbItem = [
    { label: 'Menu', to: { name: 'secured-menu' } }
]
const menus = ref([]);
const tableLoading = ref(false);
const tableFilters = ref();
const showMenuDialog = ref(false);
const menuToUpdateId = ref(null);
function initFilters() {
    tableFilters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        menuType: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        menuStatus: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'menuGroup.name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    }
};
const visbleMenuImageGalery = ref(false);
initFilters();
function getMenus() {
    tableLoading.value = true;
    axiosStore.get('/api/menu/all').then((response) => {
        menus.value = response.data;
    })
        .finally(() => {
            tableLoading.value = false;
        });
}
const menuForImageGalery = ref({});
function addMenu() {
    menuToUpdateId.value = null;
    showMenuDialog.value = true;
}
function clearFilter() {
    initFilters();
}
function editMenu(id) {
    menuToUpdateId.value = id;
    showMenuDialog.value = true;
}
function viewMenuImages(menu) {
    menuForImageGalery.value = menu;
    visbleMenuImageGalery.value = true;
}
function deleteMenuConfirmation(event, menu) {
    confirm.require({
        message: 'Adakah anda pasti untuk memadam menu ini?',
        header: 'Pengesahan',
        icon: 'pi pi-exclamation-triangle',
        target: event.currentTarget,
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Padam',
            severity: 'danger'
        },
        accept: () => {
            deleteMenu(menu.id);
        }
    });
}
function deleteMenu(menuId) {
    const loader = axiosStore.loading.show();
    axiosStore.delete(`/api/menu/${menuId}`).then((response) => {
        toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Berjaya memadam menu', life: 3000 });
        getMenus();
    })
        .finally(() => {
            loader.hide();
        });
}
onMounted(() => {
    getMenus();
});
</script>

<style scoped></style>