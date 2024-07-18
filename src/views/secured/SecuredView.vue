<template>
    <div class="card">
        <Menubar :model="menuItem">
            <template #end>
                <div class="flex items-center gap-2">
                    <Avatar icon="pi pi-power-off" style="cursor: pointer;" @click="logout"
                        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle"
                        title="log keluar" />
                    <span style="margin-left: 8px;">{{ user.user?.email }}</span>
                </div>
            </template>
        </Menubar>
    </div>
    <div class="secured-view container mx-auto">
        <Breadcrumb :home="home" :model="breadcrumbStore.breadCrumbs">
            <template #item="{ item, props }">
                <router-link v-if="item.to" v-slot="{ href, navigate }" :to="item.to" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
                </a>
            </template>
        </Breadcrumb>
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Menubar from 'primevue/menubar';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';
import { computed, reactive } from 'vue';
import Avatar from 'primevue/avatar'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from 'primevue/usetoast';
import Breadcrumb from 'primevue/breadcrumb';
import { useBreadcrumbStore } from '@/stores/breadcrumb';

const user = useUserStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const route = useRoute();
const breadcrumbStore = useBreadcrumbStore();

const menuItem = reactive([
    {
        label: 'Utama',
        icon: 'pi pi-fw pi-home',
        command: () => {
            router.push({ name: 'secured-home' });
        }
    },
    {
        label: 'Kumpulan Menu',
        icon: 'pi pi-fw pi-bars',
        command: () => {
            router.push({ name: 'secured-menugroup' });
        }
    },
    {
        label: 'Menu',
        icon: 'pi pi-fw pi-bars',
        command: () => {
            router.push({ name: 'secured-menu' });
        }
    }
]);

const home = reactive({
    icon: 'pi pi-home',
    to: { name: 'secured-home' }
});

const logout = (event) => {
    confirm.require({
        message: 'Adakah anda pasti untuk log keluar?',
        header: 'Pengesahan',
        icon: 'pi pi-exclamation-triangle',
        target: event.currentTarget,
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Log Keluar',
        },
        accept: () => {
            user.logout();
            router.go({ name: 'secured-login' });
            toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Log keluar berjaya', life: 3000 });
        }
    });
}
</script>

<style scoped>
.items-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.secured-view {
    padding: 1rem;
}

.p-breadcrumb {
    background: unset;
    padding: .5rem;
}
</style>