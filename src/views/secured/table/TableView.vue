<template>
    <div class="container mx-auto">
        <h3>TETAPAN MEJA</h3>
        <DataTable :value="tableDataComputed" :loading="tableLoading" sortable :paginator="true" :rows="10"
            :rowsPerPageOptions="[5, 10, 20]">
            <template #header>
                <div class="flex justify-end">
                    <Button label="Tambah" icon="pi pi-plus" @click="addTable" title="tambah meja" />
                </div>
            </template>
            <template #empty> Tiada rekod di temui </template>
            <template #loading> Mendapatkan data, sila tunggu... </template>
            <Column header="No">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <column field="number" header="No. Meja"></column>
            <Column field="link" header="Pautan Ke Laman Pesanan">
                <template #body="{ data }">
                    <RouterLink :to="data.link">
                        <template #default="route">
                            {{ route.route.fullPath }}
                        </template>
                    </RouterLink>
                </template>
            </Column>
            <column header="Tindakan">
                <template #body="{ data }">
                    <Button class="action-button" icon="pi pi-pencil" severity="primary" title="Sunting"
                        @click="editTable(data)" />
                    <Button class="action-button" icon="pi pi-trash" title="Padam" severity="danger"
                        @click="deleteConfirm($event, data.id)" />
                    <Button class="action-button" icon="pi pi-image" severity="info" eye title="Hasilkan Kod QR"
                        @click="GenerateQRCode(data.link)" />
                </template>
            </column>
        </DataTable>
        <TableDialog v-model:visible="showTableDialog" :tableId="tableIdToEdit" @afterSave="afterSave"></TableDialog>
    </div>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { onMounted, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAxiosStore } from '@/stores/axios';
import TableDialog from '@/components/table/TableDialog.vue';
import { useConfirm } from 'primevue/useconfirm';

const breadcrumbStore = useBreadcrumbStore();
const axiosStore = useAxiosStore();
const confirm = useConfirm();
const toast = useToast();
const tableData = ref([]);
const tableLoading = ref(false);
const tableDataComputed = computed(() => {
    return tableData.value.map((table, index) => {
        return {
            ...table,
            link: { name: 'public-order', params: { tableId: table.id } }
        }
    })
})
const showTableDialog = ref(false);
const tableIdToEdit = ref(null);

function addTable() {
    showTableDialog.value = true;
}
function editTable(data) {
    tableIdToEdit.value = data.id;
    showTableDialog.value = true;
}
function afterSave() {
    tableIdToEdit.value = null;
    GetTables();
}

function deleteConfirm(event, id) {
    confirm.require({
        message: 'Adakah anda pasti untuk memadam mmeja ini?',
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
            deleteTable(id);
        }
    });
}
function deleteTable(id) {
    const loader = axiosStore.loading.show();
    axiosStore.delete(`/api/table/${id}`).then(() => {
        GetTables();
        toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Berjaya memadam meja', life: 3000 });
    }).finally(() => {
        loader.hide();
    })
}

breadcrumbStore.breadCrumbItem = [
    { label: 'Meja', to: { name: 'secured-table' } }
]

function GetTables() {
    tableLoading.value = true;
    axiosStore.get('/api/table/all').then((response) => {
        tableData.value = response.data;
    }).catch((error) => {
        toast.add({ severity: 'error', summary: 'Ralat', detail: 'Gagal mendapatkan data meja', life: 3000 });
    }).finally(() => {
        tableLoading.value = false;
    })
}

onMounted(() => {
    GetTables();
})
</script>

<style scoped>
.action-button {
    margin-right: 0.5rem;
}
</style>