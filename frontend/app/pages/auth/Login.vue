<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Login to your Account</h1>
      </div>

      <div class="flex justify-center">
        <form @submit.prevent="handleSubmit" class="w-full max-w-xs">
          <div class="mb-4">
            <label for="email" class="block text-sm/6 font-medium py-2"
              >Email Address</label
            >
            <input
              class="p-2 border border-gray-600 outline-1 w-full"
              v-model="form.email"
              type="email"
              placeholder="Email"
              id="email"
            />
            <span
              v-if="erreur.email"
              class="text-sm font-semibold text-red-400 block mt-1"
              >{{ erreur.email[0] }}</span
            >
          </div>

          <div class="mb-4">
            <label for="password" class="block text-sm/6 font-medium py-2"
              >votre mot de passe</label
            >
            <input
              class="p-2 border border-gray-600 outline-1 w-full"
              v-model="form.password"
              type="password"
              placeholder="Mot de passe"
              id="password"
            />
            <span
              v-if="erreur.password"
              class="text-sm font-semibold text-red-400 block mt-1"
              >{{ erreur.password[0] }}</span
            >
          </div>

          <div
            v-if="erreur.message"
            class="mb-4 text-sm font-semibold text-red-500 text-center"
          >
            {{ erreur.message }}
          </div>

          <div class="mt-6">
            <button
              class="bg-blue-600 text-white p-2 w-full font-semibold"
              type="submit"
            >
              login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
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
