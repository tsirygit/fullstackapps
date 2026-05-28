<template>
  <div class="bg-white p-4 border rounded-xl shadow-sm text-center">

    <h2 class="text-lg font-semibold mb-2">
      Scannez ce QR Code
    </h2>

  
    <div
      class="flex justify-center"
      v-if="qrCodeSvg"
      v-html="qrCodeSvg"
    ></div>

    <p v-else class="text-gray-500">
  
    </p>

    <div class="mt-6">

      <p class="mb-2 font-semibold">
        Entrez le code Google Authenticator
      </p>

      <input
        v-model="code"
        type="text"
        maxlength="6"
        placeholder="123456"
        class="border p-2 rounded-lg text-center tracking-widest"
      />

    </div>

   
    <p
      v-if="errorMessage"
      class="text-red-500 mt-2"
    >
      {{ errorMessage }}
    </p>

    <button
      @click="confirm2FA"
      class="bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
    >
      Confirmer le code
    </button>

  </div>

  <div
    v-if="recoveryCode.length > 0"
    class="mt-4"
  >
    <h3 class="font-bold mb-2">
      Recovery Codes
    </h3>

    <ul class="bg-gray-100 p-4 rounded-lg">

      <li
        v-for="item in recoveryCode"
        :key="item"
        class="text-sm"
      >
        {{ item }}
      </li>

    </ul>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";

const { $api } = useNuxtApp();

const qrCodeSvg = ref("");

const recoveryCode = ref([]);

const code = ref("");

const errorMessage = ref("");

async function twoFactorInformation() {

  try {

    const responseQr = await $api("/user/two-factor-qr-code", {
      method: "GET",
    });

    if (responseQr?.svg) {
      qrCodeSvg.value = responseQr.svg;
    }

    const responseRecoveryCode = await $api(
      "/user/two-factor-recovery-codes",
      {
        method: "GET",
      }
    );

    if (Array.isArray(responseRecoveryCode)) {
      recoveryCode.value = responseRecoveryCode;
    }

  } catch (error) {

    console.error(error);
  }
}

async function confirm2FA() {

  errorMessage.value = "";

  try {

    await $api("/user/confirmed-two-factor-authentication", {
      method: "POST",
      body: {
        code: code.value,
      },
    });

    alert("2FA confirmé avec succès");

    await navigateTo("/dashboard");

  } catch (error) {

    console.log(error.response?._data);

    errorMessage.value = "Code invalide";
  }
}

onMounted(() => {
  twoFactorInformation();
});

</script>
```
