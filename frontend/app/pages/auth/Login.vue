<template>
  <h1>login</h1>

  <form @submit.prevent="handleSubmit">
    <input v-model="form.email" type="email" placeholder="Email" />
    <span v-if="erreur.email" class="bg-red-600 text-sm font-semibold">
      {{ erreur.email[0] }}</span
    >
    <input v-model="form.password" type="password" placeholder="Mot de passe" />
    <span v-if="erreur.password" class="bg-red-600 text-sm font-semibold">
      {{ erreur.password[0] }}</span
    >

    <button type="submit">login</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  email: "",
  password: "",
});

const erreur = ref({
  email: [],
  password: [],
  message: "",
});

async function handleSubmit() {
  
  erreur.value = {
    email: [],
    password: [],
    message: "",
  };

  try {
    await $fetch("http://localhost:8000/api/csrf-cookie", {
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

    console.log(res);

    await navigateTo("/dashboard");

  } catch (error) {

    console.log(error.response?._data);

    if (error.response?._data?.errors) {

      erreur.value = {
        ...erreur.value,
        ...error.response._data.errors,
      };
    } else {
      erreur.value.message = error.response?._data?.message || "Erreur serveur";
    }
  }
}
</script>
