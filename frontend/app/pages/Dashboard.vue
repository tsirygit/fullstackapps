<template>
  <h1>welcome</h1>

  <button @click="logout">logout</button>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

async function logout() {
  try {
    const token = useCookie("XSRF-TOKEN");

    await $fetch("http://localhost:8000/api/logout", {
      method: "POST",
      credentials: "include",

      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": token.value,
      },
    });

    token.value = null;

    console.log("Déconnecté");

    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Erreur logout:", error);
  }
}
</script>
