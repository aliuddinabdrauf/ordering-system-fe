<template>
    <Dialog v-model:visible="visible" modal header="Tambah Resit" style="width: 25vw;">
        <form novalidate @submit.prevent="saveReceipt">
            <div class="grid grid-cols-3 gap-4">
                <label for="order.table" class="font-semibold col-span-1">Meja</label>
                <span class="col-span-2">
                    {{ orderSummary.tableNumber }}
                </span>
                <label for="order.totalPrice" class="font-semibold col-span-1">Jumlah harga</label>
                <span class="col-span-2">
                    {{ currencyFormatter(orderSummary.totalPriceAll) }}
                </span>
                <label for="order.paymentType" class="font-semibold col-span-1">Cara Pembayaran</label>
                <div class="col-span-2">
                    <Select id="order.paymentType" :options="paymentTypeList" v-model="paymentTypeM"
                        v-bind="paymentTypeProps">
                        <template #option="slotProps">
                            <Tag :value="paymentTypeConverter(slotProps.option)"
                                :severity="paymentTypeSeverityConverter(slotProps.option)" />
                        </template>
                        <template #value="slotProps">
                            <Tag :value="paymentTypeConverter(slotProps.value)"
                                :severity="paymentTypeSeverityConverter(slotProps.value)" />
                        </template>
                    </Select>
                    <small class="field-error-msg">{{ receiptForm.errors.paymentType }}</small>
                </div>
                <label for="order.transactionId" class="font-semibold col-span-1">ID Transaksi</label>
                <div class="col-span-2">
                    <InputText id="order.transactionId" v-model="transactionId" v-bind="transactionIdProps" />
                    <small class="field-error-msg">{{ receiptForm.errors.transactionId }}</small>
                </div>
                <div class="col-span-3 flex justify-end gap-2">
                    <Button type="button" label="Batal" severity="secondary" @click="visible = false" />
                    <Button type="submit" label="Simpan" />
                </div>
            </div>
        </form>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { useForm } from 'vee-validate';
import { currencyFormatter } from '@/utils/formatter';
import Select from 'primevue/select';
import { reactive } from 'vue';
import * as yup from 'yup';
import Tag from 'primevue/tag';
import { paymentType } from '@/constants/order';
import { paymentTypeConverter, paymentTypeSeverityConverter } from '@/utils/enumConverter';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useAxiosStore } from '@/stores/axios';
import { useToast } from 'primevue/usetoast';

const axiosStore = useAxiosStore();
const toast = useToast();
const visible = defineModel('visible', { type: Boolean });
const props = defineProps({
    orderSummary: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(['afterSave']);
const paymentTypeList = reactive([
    paymentType.CASH,
    paymentType.QR_SCAN,
    paymentType.CARD,
])

const receiptForm = reactive(useForm({
    validationSchema: yup.object({
        paymentType: yup.number().required(),
        transactionId: yup.string().required(),
    }),
    initialValues: {
        paymentType: paymentType.CASH,
        transactionId: '',
    }
}));

const [paymentTypeM, paymentTypeProps] = receiptForm.defineField("paymentType");
const [transactionId, transactionIdProps] = receiptForm.defineField("transactionId");

function saveReceipt() {
    receiptForm.validate().then((result) => {
        if (result.valid) {
            const loading = axiosStore.loading.show();
            axiosStore.post('/api/receipt/add', {
                orderIds: props.orderSummary.items.map(item => item.id),
                paymentType: receiptForm.values.paymentType,
                transactionId: receiptForm.values.transactionId,
                total: props.orderSummary.totalPriceAll,
            })
                .then(() => {
                    toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Resit berjaya disimpan' });
                    emit('afterSave');
                    visible.value = false;
                })
                .finally(() => {
                    loading.hide();
                })
        }
    })
}
</script>

<style scoped>
.field-error-msg {
    color: red;
}
</style>