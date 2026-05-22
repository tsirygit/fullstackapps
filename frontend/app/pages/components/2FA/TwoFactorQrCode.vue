<template>
  <div class="bg-white p-4 border rounded-xl shadow-sm text-center">
    <h2 class="text-lg font-semibold mb-2">Scannez ce QR Code</h2>
    <div v-if="qrCodeSvg" v-html="qrCodeSvg"></div>
    <p v-else class="text-gray-500">Chargement du QR Code...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { $api } = useNuxtApp();
const { fetchUser } = useAuth();

const qrCodeSvg = ref("");

const recoveryCode = ref("");

async function twoFactorInformation() {
  await fetchUser();

  try {
    const responseQr = await $api("user/two-factor-qr-code", {
      method: "GET",
    });

    if (responseQr && responseQr.svg) {
      qrCodeSvg.value = responseQr.svg;
    }

    const responseRecoveryCode = await $api("/user/two-factor-recovery-codes", {
      method: "GET",
    });

    if (responseRecoveryCode) {
      recoveryCode.value = responseRecoveryCode;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du QR code", error);
  }
}

onMounted(() => {
  twoFactorInformation();
});
</script>
