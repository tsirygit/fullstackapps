<template>
  <div class="flex justify-center">
    <div class="text-start mb-6 mt-8 px-2">
      <h1 class="text-xl font-bold">
        Activation de la double authentification (2FA)
      </h1>

      <div class="mt-6">
        <div class="mb-2 px-2">
          <span v-if="isEnable" class="text-green-600 font-semibold"
            >2FA Enable</span
          >
          <span v-else class="text-red-600 font-semibold">2FA Disable</span>
        </div>

        <div>
          <button
            @click="openPasswordModal"
            :disabled="isEnable"
            class="bg-blue-600 text-white p-2 w-48 font-semibold rounded-xl mr-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="button"
          >
            Enable
          </button>

          <button
            @click="DesactiveTwoFactor"
            :disabled="!isEnable"
            class="bg-red-600 text-white p-2 w-48 font-semibold rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="button"
          >
            Disable
          </button>
        </div>
      </div>

      <div v-if="modalpassword" class="mt-4">
        <PasswordConfirmation
          @confirmed="activateTwoFactor"
          @close="modalpassword = false"
        />
      </div>

      <div v-if="isQrCodeVisible" class="mt-6">
        <TwoFactorQrCode />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PasswordConfirmation from "~/pages/components/PasswordConfirmation.vue";
import TwoFactorQrCode from "~/pages/components/2FA/TwoFactorQrCode.vue";

const { $api } = useNuxtApp();

const { user, fetchUser } = useAuth();

definePageMeta({
  middleware: ["auth"],
});

const isEnable = ref(false);
const modalpassword = ref(false);
const isQrCodeVisible = ref(false);

onMounted(async () => {
  try {
    await fetchUser();

    const currentUser = user?.value || user;

    if (
      currentUser &&
      (currentUser.two_factor_secret || currentUser.two_factor_enabled)
    ) {
      isEnable.value = true;

      isQrCodeVisible.value = true;
    } else {
      isEnable.value = false;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'état 2FA au rechargement",
      error,
    );
  }
});

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
    isQrCodeVisible.value = false;
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
    isQrCodeVisible.value = true;
    console.log("2FA Activé avec succès", res);
  } catch (error) {
    console.error("Erreur activation 2FA", error.response?._data);
  }
}
</script>
