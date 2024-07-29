<template>
    <div class="container mx-auto">
        <Select v-model="selectedTable" :options="allTables" optionLabel="number" optionValue="id"
            placeholder="Pilih Meja" class="w-full md:w-56" />
        &nbsp;
        <Button icon="pi pi-search" severity="success" @click="getTableActiveOrder" rounded outlined
            aria-label="Search" />

        <DataTable :value="tableOrderSummary.items">
            <Column field="menu" header="Menu"></Column>
            <Column field="price" header="Harga">
                <template #body="{ data }">
                    {{ currencyFormatter(data.price) }}
                </template>
            </Column>
            <Column field="total" header="Kuantiti"></Column>
            <Column field="totalPrice" header="Jumlah Harga">

                <template #body="{ data }">
                    {{ currencyFormatter(data.totalPrice) }}
                </template>
            </Column>
            <Column header="Tindakan"></Column>
            <ColumnGroup type="footer">
                <Row>
                    <Column footer="Jumlah:" :colspan="2" footerStyle="text-align:right" />
                    <Column :footer="tableOrderSummary.totalOrderAll" />
                    <Column>
                        <template #footer>
                            {{ currencyFormatter(tableOrderSummary.totalPriceAll) }}
                        </template>
                    </Column>
                    <column>
                        <template #footer>
                            <Button v-if="tableOrderSummary.items" @click="showAddRecieptDialog = true">Simpan
                                Resit</Button>
                        </template>
                    </column>
                </Row>
            </ColumnGroup>
        </DataTable>
    </div>
    <AddRecieptDialog v-model:visible="showAddRecieptDialog" :order-summary="tableOrderSummary" @after-save="reset" />
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import { useAxiosStore } from '@/stores/axios';
import { ref, onMounted } from 'vue';
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import { currencyFormatter } from '@/utils/formatter';
import AddRecieptDialog from '@/components/payment/AddRecieptDialog.vue';

const breadcrumbStore = useBreadcrumbStore();
const axiosStore = useAxiosStore();

const allTables = ref([]);
const selectedTable = ref(null);
const tableOrderSummary = ref({});
const showAddRecieptDialog = ref(false);

breadcrumbStore.breadCrumbItem = [
    { label: 'Pembayaran', to: { name: 'secured-payment' } }
]

function getAllTables() {
    const loading = axiosStore.loading.show();
    axiosStore.get('/api/table/all')
        .then(response => {
            allTables.value = response.data;
        })
        .finally(() => {
            loading.hide();
        })
}
function getTableActiveOrder() {
    const loading = axiosStore.loading.show();
    axiosStore.get(`/api/order/${selectedTable.value}/summary`)
        .then(response => {
            tableOrderSummary.value = response.data;
        })
        .finally(() => {
            loading.hide();
        })
}
function reset() {
    showAddRecieptDialog.value = false;
    selectedTable.value = null;
    tableOrderSummary.value = {};
}
onMounted(() => {
    getAllTables();
})
</script>

<style scoped></style>