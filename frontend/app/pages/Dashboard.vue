<template>
  <div>
    <h1>Welcome</h1>
    <!-- La condition v-if vérifie si l'utilisateur est chargé -->
    <span v-if="user">Bonjour, {{ user.name }}</span>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const user = ref(null);

async function fetchUserInfo() {
  try {
    user.value = await $fetch("http://localhost:8000/api/user", {
      credentials: "include",
    });
  } catch (error) {
    console.error("Erreur de récupération:", error);
  }
}

onMounted(() => {
  fetchUserInfo();
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
