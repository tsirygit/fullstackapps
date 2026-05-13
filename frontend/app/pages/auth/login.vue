<template>
  <h1>login</h1>

  <form @submit.prevent="handleSubmit">
    <input v-model="form.email" type="email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="Mot de passe" />

    <button type="submit">login</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  email: "",
  password: "",
});

async function handleSubmit() {
  try {
    await $fetch("http://localhost:8000/api/csrf-cookie", {
      method: "GET",
      credentials: "include",
    });
    const token = useCookie("XSRF-TOKEN");

    const res = await $fetch("http://localhost:8000/api/login", {
      method: "POST",
      body: form.value,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": token.value,
      },
    });

    console.log("Utilisateur créé et connecté !", res);

    await navigateTo("/dashboard");
  } catch (error) {
    console.error("Erreur:", error.res);
  }
}
</script>
