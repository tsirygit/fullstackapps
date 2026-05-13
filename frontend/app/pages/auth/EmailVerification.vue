<template>
  <h1>register</h1>

  <form @submit.prevent="handleSubmit">
    <input v-model="form.email" type="email" placeholder="Email" />
    <button type="submit">verify</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const form = ref({
  email: "",
});

async function handleSubmit() {
  try {
    const token = useCookie("XSRF-TOKEN");

    const res = await $fetch(
      "http://localhost:8000/api/email/verification-notification",
      {
        method: "POST",
        body: form.value,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": token.value,
        },
      },
    );

    console.log("verification d'email ", res);
  } catch (error) {
    console.error("Erreur:", error.res);
  }
}
</script>
