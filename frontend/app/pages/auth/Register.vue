<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Create new Account</h1>
      </div>

      <div class="flex justify-center">
        <form @submit.prevent="handleSubmit" class="w-full max-w-xs">
          <div class="mb-4">
            <label for="email" class="block text-sm/6 font-medium py-2"
              >Name</label
            >
            <input
              class="p-2 border border-gray-600 outline-1 w-full"
              v-model="form.name"
              type="text"
              placeholder="your name"
              id="name"
            />
            <span
              v-if="erreur.name"
              class="text-sm font-semibold text-red-400 block mt-1"
              >{{ erreur.name[0] }}</span
            >
          </div>

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
              >your password</label
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

          <div class="mb-4">
            <label for="password" class="block text-sm/6 font-medium py-2"
              >confirm your password</label
            >
            <input
              class="p-2 border border-gray-600 outline-1 w-full"
              v-model="form.password_confirmation"
              type="password"
              placeholder="Mot de passe"
              id="password"
            />
            <span
              v-if="erreur.password_confirmation"
              class="text-sm font-semibold text-red-400 block mt-1"
              >{{ erreur.password_confirmation[0] }}</span
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
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const erreur = ref({
  name: [],
  email: [],
  password: [],
  password_confirmation: [],
  message: "",
});

async function handleSubmit() {
  erreur.value = {
    name: [],
    email: [],
    password: [],
    password_confirmation: [],
    message: "",
  };

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

    await navigateTo("/auth/emailverification");

    console.log("Utilisateur créé !", res);
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
