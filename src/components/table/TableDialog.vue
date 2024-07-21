<template>
    <Dialog v-model:visible="visible" :header="`${tableId ? 'Sunting' : 'Tambah'} Meja`" modal @show="getTable"
        @hide="onClose">
        <form novalidate @submit.prevent="saveTable">
            <div class="grid grid-cols-4 gap-4">
                <label for="table.number" class="font-semibold w-24 col-span-1">Nama</label>
                <div class="col-span-3">
                    <InputText id="table.number" v-model="tableNumberField" v-bind="tableNumberProps"
                        class="modal-field" autocomplete="off" />
                    <small class="field-error-msg">{{ tableForm.errors.number }}</small>
                </div>
                <div class="col-span-4 flex justify-end gap-2">
                    <Button type="button" label="Tetap Semula" severity="info" @click="resetForm" />
                    <Button type="button" label="Batal" severity="secondary" @click="visible = false" />
                    <Button type="submit" label="Simpan" />
                </div>
            </div>
        </form>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { useAxiosStore } from '@/stores/axios';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref, reactive } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
const axiosStore = useAxiosStore();
const toast = useToast();
const visible = defineModel('visible', { type: Boolean });
const props = defineProps({
    tableId: String
});
const tableData = ref({
    number: null
});
const tableForm = reactive(useForm({
    initialValues: tableData.value,
    validationSchema: yup.object({
        number: yup.string().max(10).required()
    })
}));

const [tableNumberField, tableNumberProps] = tableForm.defineField('number');
const emits = defineEmits(['afterSave']);

function resetForm() {
    tableForm.resetForm(tableData.value);
}

function onClose() {
    tableForm.resetForm({});
}

function saveTable() {
    tableForm.validate().then((result) => {
        if (result.valid) {
            const loading = axiosStore.loading.show();
            if (props.tableId) {
                axiosStore.put(`/api/table/${props.tableId}`, {
                    number: tableForm.values.number
                })
                    .then(() => {
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan' });
                        visible.value = false;
                        emits('afterSave');
                    })
                    .finally(() => {
                        loading.hide();
                    });
            } else {
                axiosStore.post('/api/table/add', tableForm.values)
                    .then(() => {
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan' });
                        visible.value = false;
                        emits('afterSave');
                    })
                    .finally(() => {
                        loading.hide();

                    });
            }
        }
    });

}

function getTable() {
    if (props.tableId) {
        const loading = axiosStore.loading.show();
        axiosStore.get(`/api/table/${props.tableId}`)
            .then((response) => {
                tableData.value = response.data;
                tableForm.setValues(response.data);
            })
            .finally(() => {
                loading.hide();
            });
    }
}
</script>

<style scoped>
.field-error-msg {
    color: red;
}

.modal-field {
    width: 100%;
}
</style>