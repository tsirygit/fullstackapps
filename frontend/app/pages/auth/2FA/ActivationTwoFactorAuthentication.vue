<template>
  <div class="text-start mb-6 mt-8 px-2">
    <h1 class="text-xl font-bold">Activation de two factor authentication</h1>

    <div class="mt-6">
      <div class="mb-2 px-2">
        <span v-if="enable" class="text-green-600">two factor enabled</span>
        <span v-else class="text-red-600">two factor disabled</span>
      </div>
      <button
        @click="startActivation"
        class="bg-blue-600 text-white p-2 w-48 font-semibold rounded-xl"
        type="button"
      >
        Enable
      </button>
    </div>

    <div v-if="modalpassword" class="mt-4">
      <PasswordConfirmation @confirmed="activateTwoFactor" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PasswordConfirmation from "~/pages/components/PasswordConfirmation.vue";

definePageMeta({
  middleware: ["auth"],
});

const enable = ref(false);
const modalpassword = ref(false);

async function startActivation() {
  try {
    await $fetch("http://localhost:8000/api/csrf-cookie", {
      credentials: "include",
    });

    modalpassword.value = true;
  } catch (error) {
    console.error("Erreur CSRF", error);
  }
}

async function activateTwoFactor() {
  const token = useCookie("XSRF-TOKEN");

  try {
    const res = await $fetch(
      "http://localhost:8000/api/user/two-factor-authentication",
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": token.value,
        },
      }
    );

    enable.value = true;

    modalpassword.value = false;

    await navigateTo('/auth/2FA/TwoFactorQrcode');

    console.log("2FA Activé avec succès", res);
  } catch (error) {
    console.error("Erreur activation 2FA", error.response?._data);
  }
}
</script>
