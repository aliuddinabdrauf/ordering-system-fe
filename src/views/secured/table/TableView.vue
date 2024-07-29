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
                        @click="generateQRCode(data)" />
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
import { useRouter } from 'vue-router';

const breadcrumbStore = useBreadcrumbStore();
const axiosStore = useAxiosStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
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
    getTables();
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
        getTables();
        toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Berjaya memadam meja', life: 3000 });
    }).finally(() => {
        loader.hide();
    })
}

breadcrumbStore.breadCrumbItem = [
    { label: 'Meja', to: { name: 'secured-table' } }
]

function getTables() {
    tableLoading.value = true;
    axiosStore.get('/api/table/all').then((response) => {
        tableData.value = response.data;
    }).catch((error) => {
        toast.add({ severity: 'error', summary: 'Ralat', detail: 'Gagal mendapatkan data meja', life: 3000 });
    }).finally(() => {
        tableLoading.value = false;
    })
}
function generateQRCode(table) {
    const link = router.resolve(table.link).href;
    const loading = axiosStore.loading.show();
    axiosStore.get(`/api/table/${table.id}/qrcode`, {
        params: {
            link
        },
        responseType: 'blob'
    })
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Berjaya menghasilkan kod QR', life: 3000 });
            //from : https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
            // create file link in browser's memory
            const href = URL.createObjectURL(response.data);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'qrImage.png'); //or any other extension
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        })
        .finally(() => {
            loading.hide();
        })
}
onMounted(() => {
    getTables();
})
</script>

<style scoped>
.action-button {
    margin-right: 0.5rem;
}
</style>