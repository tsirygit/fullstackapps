<template>
  <div class="bg-gray-200 w-72 p-4 rounded-xl">
    <div class="flex justify-center">
      <form @submit.prevent="verifyPassword" class="w-full max-w-xs">
        <div class="mb-4">
          <input
            class="p-2 border outline-1 w-full rounded-lg"
            type="password"
            v-model="form.password"
            placeholder="Password confirmation"
            id="password"
          />

          <p v-if="erreur.message" class="text-red-500 text-xs mt-1">
            {{ erreur.message }}
          </p>
        </div>
        <div class="mt-6">
          <button
            class="bg-blue-600 text-white p-2 w-full font-semibold rounded-xl"
            type="submit"
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["confirmed"]);

const form = ref({ password: "" });

const erreur = ref({ message: "" });

async function verifyPassword() {
  try {
    await $fetch("http://localhost:8000/api/csrf-cookie", {
      credentials: "include",
    });

    const token = useCookie("XSRF-TOKEN");

    await $fetch("http://localhost:8000/api/user/confirm-password", {
      method: "POST",
      body: form.value,
      credentials: "include",
      headers: { Accept: "application/json", "X-XSRF-TOKEN": token.value },
    });

    emit("confirmed");
  } catch (error) {
    erreur.value.message = error.response?._data?.message || "password invalid";
  }
}
</script>
