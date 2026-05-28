<template>
  <div>
    <h1>Welcome</h1>
    <span v-if="user">Bonjour, {{ user.name }}</span>
    <button @click="logout">Logout</button>
  </div>
  <div>
    <button class="p-2 bg-red-600 w-32">Setting</button>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const { $api } = useNuxtApp();

const { fetchUser } = useAuth();

const user = useState("user", () => null);

async function fetchUserInfo() {
  try {
    await fetchUser();
  } catch (error) {
    console.error("Erreur de récupération:", error);
  }
}

onMounted(() => {
  fetchUserInfo();
});

async function logout() {
  try {
    await $api("/logout", {
      method: "POST",
    });

    console.log("Déconnecté");

    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Erreur logout:", error);
  }
}
</script>
