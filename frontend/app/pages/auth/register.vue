<template>
  <h1>register</h1>

  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" type="text" placeholder="Nom" />
    <input v-model="form.email" type="email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="Mot de passe" />
    <input
      v-model="form.password_confirmation"
      type="password"
      placeholder="Confirmer le mot de passe"
    />
    <button type="submit">Register</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
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

    const res = await $fetch("http://localhost:8000/api/register", {
      method: "POST",
      body: form.value,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": token,
      },
    });

    console.log("Utilisateur créé et connecté !", res);
  } catch (error) {
    console.error("Erreur:", error.res);
  }
}
</script>
