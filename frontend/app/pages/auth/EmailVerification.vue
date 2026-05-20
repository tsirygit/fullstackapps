<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">enter your email address</h1>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <input
            class="p-2 border outline-1 w-full rounded-lg"
            v-model="form.email"
            type="email"
            placeholder="Email Address"
            id="email"
          />
          <span
            v-if="erreur.email"
            class="text-sm font-semibold text-red-400 block mt-1"
            >{{ erreur.email[0] }}</span
          >
        </div>
        <div class="mt-6">
          <button
            class="bg-blue-600 text-white p-2 w-full font-semibold rounded-2xl"
            type="submit"
          >
            verification
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const form = ref({
  email: "",
});

const erreur = ref({
  email: [],
  message: "",
});

async function handleSubmit() {
  erreur.value = {
    email: [],
    message: "",
  };

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
