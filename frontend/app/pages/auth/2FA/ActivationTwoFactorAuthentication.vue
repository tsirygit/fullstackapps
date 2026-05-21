<template>
  <div class="text-start mb-6 mt-8 px-2">
    <h1 class="text-xl font-bold">Activation de two factor authentication</h1>
    <div class="mt-6">
      <div class="mb-2 px-2">
        <span v-if="isEnable" class="text-green-600 font-semibold"
          >two factor enabled</span
        >
        <span v-else class="text-red-600 font-semibold"
          >two factor disabled</span
        >
      </div>
      <div>
        <button
          @click="openPasswordModal"
          class="bg-blue-600 text-white p-2 w-48 font-semibold rounded-xl mr-2"
          type="button"
        >
          Enable
        </button>
        <button
          @click="DesactiveTwoFactor"
          class="bg-red-600 text-white p-2 w-48 font-semibold rounded-xl"
          type="button"
        >
          Disable
        </button>
      </div>
    </div>
    <div v-if="modalpassword" class="mt-4">
      <PasswordConfirmation @confirmed="activateTwoFactor" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PasswordConfirmation from "~/pages/components/PasswordConfirmation.vue";

const { $api } = useNuxtApp();

definePageMeta({
  middleware: ["auth"],
});

const isEnable = ref(false);

const modalpassword = ref(false);

function openPasswordModal() {
  modalpassword.value = true;
}

async function DesactiveTwoFactor() {
  try {
    const res = await $api(
      "http://localhost:8000/api/user/two-factor-authentication",
      {
        method: "DELETE",
      },
    );
    isEnable.value = false;
    console.log("2FA est désactivé avec succès", res);
  } catch (error) {
    console.error("Erreur désactivation de 2FA", error.response?._data);
  }
}

async function activateTwoFactor() {
  try {
    const res = await $api(
      "http://localhost:8000/api/user/two-factor-authentication",
      {
        method: "POST",
      },
    );
    isEnable.value = true;

    modalpassword.value = false;

    console.log("2FA Activé avec succès", res);
  } catch (error) {
    console.error("Erreur activation 2FA", error.response?._data);
  }
}
</script>
