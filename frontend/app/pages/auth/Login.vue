<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Sign In to your Account</h1>
      </div>

      <div class="flex justify-center">
        <form @submit.prevent="handleSubmit" class="w-full max-w-xs">
          <div class="mb-4">
            <input
              class="p-2 border outline-1 w-full rounded-md"
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

          <div class="mb-4">
            <input
              class="p-2 border outline-1 w-full rounded-md"
              v-model="form.password"
              type="password"
              placeholder="Password"
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
              class="bg-blue-600 text-white p-2 w-full font-semibold rounded-xl"
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

const { fetchUser } = useAuth();

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

    await fetchUser();

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
