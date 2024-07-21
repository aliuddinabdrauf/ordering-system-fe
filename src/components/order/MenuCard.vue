<template>
    <Card class="w-full">
        <template #header>
            <div class="relative mx-auto">
                <Galleria :value="imageUrls" :numVisible="1" :circular="true" :autoplayInterval="5000" :autoplay="true"
                    :style="{ maxWidth: '100%' }" :showThumbnails="true" :showIndicators="false">
                    <template #item="slotProps">
                        <img :src="slotProps.item" :alt="slotProps.item" style="width: 100%; display: block" />
                    </template>
                </Galleria>
                <Tag :value="menuStatusConverter(menu.menuStatus)"
                    :severity="menuStatusSeverityConverter(menu.menuStatus)" class="absolute"
                    style="left:5px; top: 5px" />

            </div>
        </template>
        <template #title>{{ menu?.name }}</template>
        <template #content>
            <div ref="textContainer" class="text-container" v-html="menu?.description">
            </div>
            <div class="flex justify-between items-center">
                <div class="mt-0 font-semibold text-md">{{ currencyFormatter(menu.price) }}</div>
                <div style="display: flex">
                    <Button size="small" v-if="isOverflowing" icon="pi pi-ellipsis-v"
                        @click="showFullText = !showFullText" severity="secondary" title="lagi..." outlined />
                    <OverlayBadge v-if="totalInCart" :value="totalInCart">
                        <Button size="small" icon="pi pi-shopping-cart" @click="addToCart" class="ml-2"
                            title="tambah pada troli..." />
                    </OverlayBadge>
                    <Button size="small" v-else icon="pi pi-shopping-cart" @click="addToCart" class="ml-2"
                        title="tambah pada troli..." />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import { defineProps, computed, ref, watch, onMounted } from 'vue';
import { generateLinkFromFileId } from '@/utils/file';
import { menuTypesObj } from '@/constants/menu';
import mainCourseImg from '@/assets/images/default_main_course.jpg';
import drinksImg from '@/assets/images/default_drinks.jpg';
import dessertImg from '@/assets/images/default_dessert.jpg';
import othersImg from '@/assets/images/default_others.jpg';
import Tag from 'primevue/tag';
import { menuStatusConverter, menuStatusSeverityConverter } from '@/utils/enumConverter';
import { currencyFormatter } from '@/utils/formatter';
import Button from 'primevue/button';
import Galleria from 'primevue/galleria';
import { useOrderStore } from '@/stores/order';
import OverlayBadge from 'primevue/overlaybadge';

const orderStore = useOrderStore();
const props = defineProps({
    menu: Object,
});
const totalInCart = ref(0);

const imageUrls = computed(() => {
    if (props.menu?.images.length > 0) {
        return props.menu?.images.map(o => generateLinkFromFileId(o.id, o.fullName));
    }
    else {
        if (props.menu?.menuType === menuTypesObj.MainCourse) {
            return [mainCourseImg];
        }
        else if (props.menu?.menuType === menuTypesObj.Drinks) {
            return [drinksImg];
        }
        else if (props.menu?.menuType === menuTypesObj.Dessert) {
            return [dessertImg];
        }
        else {
            return [othersImg];
        }
    }
});
const textContainer = ref(null);
const isOverflowing = ref(false);
const showFullText = ref(false);

function checkOverflow() {
    if (textContainer.value) {
        const container = textContainer.value;
        isOverflowing.value = container.scrollHeight > container.clientHeight;
    }
};
function addToCart() {
    orderStore.addMenuToCart(props.menu);
    totalInCart.value = orderStore.getTotalMenuInCart(props.menu.id);
}
watch(showFullText, () => {
    if (showFullText.value) {
        // Temporarily expand the container to show full text
        textContainer.value.style.height = 'unset';
    } else {
        // Re-apply the max height restriction
        textContainer.value.style.height = '50px';
        checkOverflow(); // Re-check overflow in case of dynamic content changes
    }
});
onMounted(() => {
    checkOverflow();
    totalInCart.value = orderStore.getTotalMenuInCart(props.menu.id);
});
</script>

<style scoped>
.text-container {
    position: relative;
    width: 100%;
    /* Fixed width */
    height: 50px;
    padding-bottom: 1rem;
    /* Fixed height */
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    /* Adjust based on your needs */
    background: linear-gradient(to bottom, transparent, white);
    /* Adjust the color to match your background */
}
</style>