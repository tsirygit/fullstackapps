<template>
  <div v-if="!isClose" class="bg-gray-200 w-72 p-4 rounded-xl">
    <div class="flex justify-center">
      <form @submit.prevent="verifyPassword" class="w-full max-w-xs">
        <div class="mb-4">
          <span 
            @click="closePasswordVerify" 
            class="flex justify-end text-xl text-red-600 cursor-pointer hover:text-red-800 transition"
          >
            X
          </span>
          <div class="pt-2">
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
        </div>
        <div class="mt-6">
          <button
            class="bg-blue-600 text-white p-2 w-full font-semibold rounded-xl hover:bg-blue-700 transition"
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

const { $api } = useNuxtApp();

const emit = defineEmits(["confirmed", "close"]);

const form = ref({ password: "" });

const erreur = ref({ message: "" });

const isClose = ref(false);

function closePasswordVerify() {

  isClose.value = true;

  emit("close");
}

async function verifyPassword() {

  erreur.value.message = ""; 
  
  try {
    await $api("/csrf-cookie", {
      method: "GET",
    });
    
    await $api("/user/confirm-password", {
      method: "POST",
      body: form.value, 
    });
    
    emit("confirmed");
  } catch (error) {
    erreur.value.message = error.response?._data?.message || "Password invalid";
  }
}
</script>