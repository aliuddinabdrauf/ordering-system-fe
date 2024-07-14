<template>
    <Dialog v-model="visible" :header="`${menuId ? 'Update' : 'Add'} Menu`" modal v-model:visible="visible"
        @hide="onHideDialog" :style="{ 'min-width': '30vw' }">
        <form novalidate @submit.prevent="saveMenu">
            <div class="grid grid-cols-4 gap-4">
                <label for="menu.name" class="font-semibold w-24 col-span-1">Name</label>
                <div class="col-span-3">
                    <InputText id="menu.name" v-model="name" v-bind="nameProps" class="modal-field"
                        autocomplete="off" />
                    <small class="field-error-msg">{{ menuForm.errors.name }}</small>
                </div>
                <label for="menu.description" class="font-semibold w-24 col-span-1">Description</label>
                <div class="col-span-3">
                    <Editor id="menu.description" v-model="description" v-bind="descriptionProps" class="modal-field" />
                    <small class="field-error-msg">{{ menuForm.errors.description }}</small>
                </div>
                <label for="menu.menuType" class="font-semibold w-24 col-span-1">Menu Type</label>
                <div class="col-start-2 col-end-3">
                    <MenuTypeSelect id="menu.menuType" v-model:value="menuType" v-bind="menuTypeProps"
                        class="modal-field" />
                    <small class="field-error-msg">{{ menuForm.errors.menuType }}</small>
                </div>
                <label for="menu.menuStatus" class="font-semibold w-24 col-start-1 col-end-2">Menu Status</label>
                <div class="col-start-2 col-end-3">
                    <MenuStatusSelect id="menu.menuStatus" v-model:value="menuStatus" v-bind="menuStatusProps"
                        class="modal-field" />
                    <small class="field-error-msg">{{ menuForm.errors.menuType }}</small>
                </div>
                <label for="menu.price" class="font-semibold w-24 col-span-1 col-start-1">Price</label>
                <InputNumber id="menu.price" v-model="price" v-bind="priceProps" inputId="currency-malaysia"
                    mode="currency" currency="MYR" locale="ms-MY" />
                <small class="field-error-msg">{{ menuForm.errors.price }}</small>
                <label for="menu.menuGroupId" class="font-semibold w-24 col-span-1 col-start-1">Menu Group</label>
                <div class="col-span-2">
                    <Select id="menu.menuGroupId" v-model="menuGroupId" class="modal-field" :options="menuGroups"
                        optionLabel="name" optionValue="id" show-clear />
                    <small class="field-error-msg">{{ menuForm.errors.menuGroupId }}</small>
                </div>
                <label for="menu.price" class="font-semibold w-24 col-span-1 col-start-1">Images</label>
                <div class="font-semibold w-24 col-span-3 modal-field">
                    <el-upload ref="uploadImageRef" :file-list="existingImageList" :auto-upload="false" accept="image/*"
                        list-type="picture-card" :on-preview="handlePictureCardPreview" :on-change="handleChange"
                        :on-remove="handleRemove">
                        <i class="pi pi-plus" style="font-size: 1rem"></i>
                    </el-upload>
                </div>
                <div class="col-span-4 flex justify-end gap-2">
                    <Button type="button" label="Reset" severity="info" @click="resetForm" />
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false" />
                    <Button type="submit" label="Save" />
                </div>
            </div>
        </form>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import { onMounted, reactive, ref, watch } from 'vue'
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Editor from 'primevue/editor';
import MenuTypeSelect from '@/components/MenuTypeSelect.vue';
import MenuStatusSelect from '@/components/MenuStatusSelect.vue';
import { useAxiosStore } from '@/stores/axios';
import Select from 'primevue/select';
import { ElUpload } from 'element-plus';
import 'element-plus/es/components/upload/style/css';
import Button from 'primevue/button';

const axiosStore = useAxiosStore();
const uploadImageRef = ref();
const props = defineProps({
    menuId: String
})
const menuModel = ref({});
const visible = defineModel('visible', { type: Boolean });
const menuForm = useForm({
    validationSchema: yup.object({
        id: yup.string().optional(),
        name: yup.string().max(100).required(),
        description: yup.string().max(1000).required(),
        menuType: yup.number().required(),
        menuStatus: yup.number().required(),
        price: yup.number().required(),
        menuGroupId: yup.string().notRequired()
    },
    ),
    initialValues: {
        name: null,
        description: null,
        menuType: 1,
        menuStatus: 0,
        price: null,
        menuGroupId: null
    }
})

const existingImageList = ref([{
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    id: "test"
}]);
const newImageList = ref([]);
const removedImageIdList = ref([]);


const [name, nameProps] = menuForm.defineField('name');
const [description, descriptionProps] = menuForm.defineField('description');
const [menuType, menuTypeProps] = menuForm.defineField('menuType');
const [menuStatus, menuStatusProps] = menuForm.defineField('menuStatus');
const [price, priceProps] = menuForm.defineField('price');
const [menuGroupId] = menuForm.defineField('menuGroupId');

const menuGroups = ref([]);

function onHideDialog() {
    menuForm.resetForm();
    resetImages();
    existingImageList.value = [];
}
function GetMenuGroups() {
    var loader = axiosStore.loading.show();
    axiosStore.get('/api/menu/group/all').then((response) => {
        menuGroups.value = response.data;
    }).finally(() => {
        loader.hide();
    });
}
function handlePictureCardPreview(file) {
}

function handleChange(file, fileList) {
    newImageList.value = fileList.filter(o => !o.id);
}

function handleRemove(file, fileList) {
    newImageList.value = fileList;
    if (file.id) {
        removedImageList.value.push(file.id);
    }
}
function resetForm() {
    if (props.menuId) {
        menuForm.resetForm(menuModel.value);
    }
    else {
        menuForm.resetForm();
    }
    resetImages()
}
function resetImages() {
    newImageList.value = [];
    removedImageIdList.value = [];
    uploadImageRef.value?.clearFiles(['ready']);
}

function saveMenu() {
    menuForm.validate().then((result) => {
        if (result.valid) {
            console.log("ddd");
            saveMenuDetails();
        }
    });
}
function saveMenuDetails() {
    var loader = axiosStore.loading.show();
    if (props.menuId) {
        axiosStore.put('/api/menu/update', {
            id: props.menuId,
            name: menuForm.values.name,
            description: menuForm.values.description,
            menuType: menuForm.values.menuType,
            menuStatus: menuForm.values.menuStatus,
            price: menuForm.values.price,
            menuGroupId: menuForm.values.menuGroupId
        }).then((response) => {
            visible = false;
            GetMenus();
        }).finally(() => {
            loader.hide();
        });
    }
    else {
        axiosStore.put('/api/menu/add', {
            name: menuForm.values.name,
            description: menuForm.values.description,
            menuType: menuForm.values.menuType,
            menuStatus: menuForm.values.menuStatus,
            price: menuForm.values.price,
            menuGroupId: menuForm.values.menuGroupId
        }).then((response) => {
            const newMenuId = response.data.id;
            uploadImages(newMenuId, loader);
        }).catch(() => {
            loader.hide();
        })
    }
}
function uploadImages(newMenuId, loader) {
    if (newImageList.value.length > 0) {
        var formData = new FormData();
        newImageList.value.forEach(file => {
            formData.append('images', file.raw);
        });
        axiosStore.post(`/api/menu/upload/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            const imageIds = response.data.map(o => o.id);
            mapAndDeleteImagesToMenu(imageIds, newMenuId, loader);
        }).catch(() => {
            loader.hide();
        })
            //remove this line after mapAndDeleteImagesToMenu function is implemented
            .finally(() => {
                loader.hide();
            })
    }
    else {
        visible.value = false;
    }
}
function mapAndDeleteImagesToMenu(imageIds, menuId, loader) {
}

onMounted(() => {
    GetMenuGroups();
})
</script>

<style scoped>
.modal-field {
    width: 100%;
}
</style>