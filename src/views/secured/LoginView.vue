<template>
  <div class="login-container">
    <Card style="width: 25rem; overflow: hidden">
      <template #title>
        <div style="display:flex;justify-content: center;">LOG MASUK</div>
      </template>
      <template #content>
        <form novalidate @submit.prevent="onSubmit">
          <InputText class="login-field" v-bind="emailProps" v-model="email" type="email" placeholder="Emel" />
          <small class="field-error-msg">{{ loginForm.errors.email }}</small>
          <InputText class="login-field" v-bind="passwordProps" v-model="passowrd" type="password"
            placeholder="Kata laluan" />
          <small class="field-error-msg">{{ loginForm.errors.password }}</small>
          <div>
            <Button class="login-field" type="submit" label="Log Masuk" />
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { reactive } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAxiosStore } from "@/stores/axios";
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const toast = useToast();
const router = useRouter();

const loginForm = reactive(useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  },
  )
}));
const axiosStore = useAxiosStore();
const [email, emailProps] = loginForm.defineField('email');
const [passowrd, passwordProps] = loginForm.defineField('password');
const user = useUserStore();
function onSubmit() {
  loginForm.validate().then((result) => {
    if (result.valid) {
      const loader = axiosStore.loading.show();
      axiosStore.post('/api/authenticate/login', loginForm.values).then((response) => {
        user.authToken = response.data.token;
        toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Log masuk berjaya', life: 3000 });
        router.push({ name: 'secured-home' });
      }).catch((error) => {
      })
        .finally(() => {
          loader.hide();
        })
    }
  });
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-field {
  width: 100%;
  margin-top: 1rem;
}

.field-error-msg {
  color: red;
}
</style>
