<template>
    <div class="container mx-auto grid grid-cols-5 gap-2">
        <OrderCard v-for="(order, index) in activeOrders" v-model:order="activeOrders[index]">

        </OrderCard>
    </div>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useUserStore } from '@/stores/user';
import { useAxiosStore } from '@/stores/axios';
import { onMounted, ref, computed } from 'vue';
import OrderCard from '@/components/order/OrderCard.vue';

const userStore = useUserStore();
const axiosStore = useAxiosStore();
const allMenus = ref([]);
const allTables = ref([]);
const activeOrders = ref([]);
//#region SignalR
//initialize signalr connection
const orderHubConnection = new HubConnectionBuilder()
    .withUrl('/api/hubs/order?access_token=' + userStore.authToken)
    .build();
//listen to new order event
orderHubConnection.on("new-order", newOrders => {
    onReceiveNewOrder(newOrders);
});
orderHubConnection.on("order-updated", order => {
    onUpdatedOrderStatus(order);
});
//start connection
async function startConnection() {
    try {
        await orderHubConnection.start();
        //get active order after connection started
        getActiveOrder();
        console.log('Connection started!');
    } catch (err) {
        console.log('Error while establishing connection :(. Will retry in 5 seconds', err);
        setTimeout(() => startConnection(), 5000);
    }
}
//#endregion
const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.breadCrumbItem = []

function onReceiveNewOrder(order) {

}
function onUpdatedOrderStatus() {

}
function assignOrders(orders) {
    activeOrders.value = orders.map(order => {
        const table = allTables.value.find(table => table.id === order.tableId);
        return {
            ...order,
            tableName: table?.number
        }
    })
}
function getAllMenus() {
    axiosStore.get('api/menu/all').then(res => {
        allMenus.value = res.data;
        //only start connection after success get all menu
        startConnection();
    })
}
function getAllTables() {
    axiosStore.get('api/table/all').then(res => {
        if (res.data) {
            allTables.value = res.data;
        }
    })
}
function getActiveOrder() {
    axiosStore.get('api/order/all/active').then(res => {
        if (res.data) {
            assignOrders(res.data);
        }
    })
}
onMounted(() => {
    getAllMenus();
    getAllTables();
})
</script>

<style lang="scss" scoped></style>