<template>
    <Dialog v-model:visible="visible" pt:root:class="!border-0 !bg-transparent" pt:mask:class="backdrop-blur-sm">
        <div class="card">
            <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5"
                containerStyle="max-width: 640px">
                <template #item="slotProps">
                    <img :src="slotProps.item.source" :alt="slotProps.item.alt" style="width: 100%" />
                </template>
                <template #thumbnail="slotProps">
                    <img :src="slotProps.item.source" :alt="slotProps.item.alt"
                        style="max-width: 5rem; max-height: 5rem;" />
                </template>
            </Galleria>
        </div>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Galleria from 'primevue/galleria';
import { computed, defineModel, defineProps, ref } from 'vue';
import { generateLinkFromFileId } from '@/utils/file';

const visible = defineModel('visible', { type: Boolean });
const prop = defineProps({
    menu: Object
});
const images = computed(() => {
    return prop.menu?.images.map((image) => {
        return {
            source: generateLinkFromFileId(image.id, image.fullName),
            alt: image.fullName,
            title: image.fullName
        }
    });
});
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
</script>

<style scoped></style>