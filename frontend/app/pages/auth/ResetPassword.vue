<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Reset your password</h1>
      </div>

      <div class="flex justify-center">
        <form @submit.prevent="handleSubmit" class="w-full max-w-xs">
          <div class="mb-4">
            <input
              class="p-2 border outline-1 w-full rounded-lg"
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
            <input
              class="p-2 border outline-1 w-full rounded-lg"
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

          <div class="mb-4">
            <input
              class="p-2 border outline-1 w-full rounded-lg"
              v-model="form.password_confirmation"
              type="password"
              placeholder="Password_confirmation"
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
              class="bg-blue-600 text-white p-2 w-full font-semibold rounded-2xl"
              type="submit"
            >
              new password
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

const route = useRoute();

const form = ref({
  token: route.query.token,
  email: route.query.email,
  password: "",
  password_confirmation: "",
});

const erreur = ref({
  email: [],
  password: [],
  password_confirmation: [],
  message: "",
});

async function handleSubmit() {
  erreur.value = {
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

    const res = await $fetch("http://localhost:8000/api/reset-password", {
      method: "POST",
      body: form.value,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": token,
      },
    });

    await fetchUser();

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
