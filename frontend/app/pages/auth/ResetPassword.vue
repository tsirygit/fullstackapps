<template>
  <h1>reset password</h1>

  <form @submit.prevent="handleSubmit">
    <input type="hidden" v-model="form.token" />
    <input v-model="form.email" type="email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="Mot de passe" />
    <input
      v-model="form.password_confirmation"
      type="password"
      placeholder="Confirmer le mot de passe"
    />
    <button type="submit">reset</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
const route = useRoute();

const form = ref({
  token: route.query.token,
  email: route.query.email,
  password: "",
  password_confirmation: "",
});

async function handleSubmit() {
  try {
    await $fetch("http://localhost:8000/api/csrf-cookie", {
      method: "GET",
      credentials: "include",
    });
    const token = useCookie("XSRF-TOKEN").value;

    const res = await $fetch("http://localhost:8000/api/reset-password", {
      method: "POST",
      body: form.value,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": token,
      },
    });

    await navigateTo("/auth/emailverification");

    console.log("Utilisateur créé !", res);
  } catch (error) {
    console.error("Erreur:", error.res);
  }
}
</script>
