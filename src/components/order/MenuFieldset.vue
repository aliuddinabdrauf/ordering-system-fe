<template>
    <Fieldset class="w-full" :legend="menuByGroup.name">
        <div class="flex flex-wrap">
            <div class="w-1/2 sm:w-1/3 lg:w-1/4 p-2" v-for="menu in menuByGroup?.menus" :key="menu.id">
                <MenuCard :menu="menu">

                </MenuCard>
            </div>
        </div>
    </Fieldset>
</template>

<script setup>
import Fieldset from 'primevue/fieldset';
import { defineProps } from 'vue';
import MenuCard from './MenuCard.vue';

const props = defineProps({
    menuByGroup: Object
});
</script>

<style scoped></style>