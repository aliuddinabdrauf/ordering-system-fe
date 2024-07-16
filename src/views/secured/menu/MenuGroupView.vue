<template>
    <div class="container mx-auto">
        <h3>MENU GROUP</h3>
        <div class="flex flex-row-reverse">
            <div>
                <Button label="Add" icon="pi pi-plus" @click="addMenuGroupModal" />
            </div>
        </div>
        <div class="container mx-auto">
            <DataTable :value="menuGroups" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]">
                <Column header="No">
                    <template #body="{ index }">
                        {{ index + 1 }}
                    </template>
                </Column>
                <Column field="name" header="Name"></Column>
                <Column field="description" header="Description"></Column>
                <Column header="Action">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" title="edit" severity="primary" rounded
                            @click="editMenuGroup(data)" />
                        <Button icon="pi pi-eye" title="view menu" severity="info" rounded
                            @click="viewMenuInMenuGroup($event, data)" />
                        <Button icon="pi pi-trash" title="delete menu" severity="danger" rounded
                            @click="deleteMenuGroupConfirmation($event, data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Dialog v-model:visible="menuGroupModalVisble" modal
        :header="`${modalType === 'add' ? 'Add' : 'Update'} Menu Group`" @hide="menuGroupForm.resetField"
        :style="{ width: '25rem' }">
        <form novalidate @submit.prevent="saveMenuGroup" style="width:100%">
            <div class="flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold w-24">Name</label>
                <div style="width:100%">
                    <InputText v-model="name" v-bind="nameProps" class="modal-field flex-auto" autocomplete="off" />
                    <small class="field-error-msg">{{ menuGroupForm.errors.name }}</small>
                </div>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">Description</label>
                <div style="width:100%">
                    <Textarea v-model="description" v-bind="descriptionProps" class="modal-field flex-auto"
                        autocomplete="off" />
                    <small class="field-error-msg">{{ menuGroupForm.errors.description }}</small>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary"
                    @click="menuGroupModalVisble = false"></Button>
                <Button type="submit" label="Save"></Button>
            </div>
        </form>
    </Dialog>
    <Popover ref="menusPopOver" appendTo="body" @hide="groupMenus = []">
        <DataTable :value="groupMenusComputed" :paginator="true" :rows="5">
            <Column header="No">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <Column field="name" header="Name"></Column>
            <Column field="description" header="Description">
                <template #body="{ data }">
                    <span v-html="data.description"></span>
                </template>
            </Column>
            <Column field="menuType" header="Type"> </Column>
            <Column field="price" header="Price">
                <template #body="{ data }">
                    {{ currencyFormatter(data.price) }}
                </template>
            </Column>
            <Column field="menuStatus" header="Status"></Column>
        </DataTable>
    </Popover>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, reactive, ref } from 'vue';
import { useAxiosStore } from '@/stores/axios';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import Popover from 'primevue/popover';
import { menuStatusConverter, menuTypeConverter } from '@/utils/enumConverter';
import { computed } from 'vue';
import { currencyFormatter } from '@/utils/formatter';

const confirm = useConfirm()
const axiosStore = useAxiosStore();
const toast = useToast();
const menuGroupModalVisble = ref(false);
const modalType = ref('');
const menusPopOver = ref();
const menuGroupForm = reactive(useForm({
    validationSchema: yup.object({
        id: yup.string().optional(),
        name: yup.string().max(100).required(),
        description: yup.string().max(200).required(),
    },
    )
}));
const [name, nameProps] = menuGroupForm.defineField('name');
const [description, descriptionProps] = menuGroupForm.defineField('description');
const [id] = menuGroupForm.defineField('id');
const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.breadCrumbItem = [
    { label: 'Menu Group', to: { name: 'secured-menugroup' } }
]
const menuGroups = ref([]);
const groupMenus = ref([]);
const groupMenusComputed = computed(() => {
    const data = [];
    groupMenus.value.forEach((menu) => {
        data.push({
            ...menu,
            menuType: menuTypeConverter(menu.menuType),
            menuStatus: menuStatusConverter(menu.menuStatus)
        })
    })
    return data;
})
function getMenuGroupData() {
    const loader = axiosStore.loading.show();
    axiosStore.get('/api/menu/group/all').then((response) => {
        menuGroups.value = response.data;
    })
        .finally(() => {
            loader.hide();
        })
}

function addMenuGroupModal() {
    modalType.value = 'add';
    menuGroupForm.resetForm();
    menuGroupModalVisble.value = true;
}
function editMenuGroup(data) {
    modalType.value = 'update';
    menuGroupForm.resetForm();
    menuGroupForm.setValues(data);
    menuGroupModalVisble.value = true;
}

function saveMenuGroup() {
    menuGroupForm.validate().then((result) => {
        if (result.valid) {
            const loader = axiosStore.loading.show();
            if (modalType.value === 'add') {
                axiosStore.post('/api/menu/group/add', {
                    name: menuGroupForm.values.name,
                    description: menuGroupForm.values.description
                }).then((response) => {
                    getMenuGroupData();
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Success Add Menu Group', life: 3000 });
                    menuGroupModalVisble.value = false;
                }).finally(() => {
                    loader.hide();
                })
            }
            else {
                axiosStore.put(`/api/menu/group/${id.value}`, {
                    name: menuGroupForm.values.name,
                    description: menuGroupForm.values.description
                }).then((response) => {
                    getMenuGroupData();
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Success Update Menu Group', life: 3000 });
                    menuGroupModalVisble.value = false;
                }).finally(() => {
                    loader.hide();
                })
            }
        }
    });
}
function deleteMenuGroupConfirmation(event, menuGroupId) {
    confirm.require({
        message: 'Are you sure you want to delete this menu group?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        target: event.currentTarget,
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            deleteMenuGroup(menuGroupId.id);
        }
    });
}
function deleteMenuGroup(menuGroupId) {
    const loader = axiosStore.loading.show();
    axiosStore.delete(`/api/menu/group/${menuGroupId}`).then((response) => {
        getMenuGroupData();
        toast.add({ severity: 'success', summary: 'Success', detail: 'Success Delete Menu Group', life: 3000 });
    }).finally(() => {
        loader.hide();
    })
}
function viewMenuInMenuGroup(event, menuGroup) {
    menusPopOver.value.toggle(event);
    const loader = axiosStore.loading.show();
    axiosStore.get(`/api/menu/group/${menuGroup.id}/menus`).then((response) => {
        groupMenus.value = response.data;
    }).finally(() => {
        loader.hide();
    })
}
onMounted(() => {
    getMenuGroupData();
})
</script>

<style scoped>
.field-error-msg {
    color: red;
}

.modal-field {
    width: 100%;
    margin-top: 1rem;
}

.p-button {
    margin-right: 0.5rem;
}
</style>