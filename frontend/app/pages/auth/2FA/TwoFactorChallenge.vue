<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Entrer le code à 6 chiffres</h1>
      </div>

      <!-- Affichage de l'erreur générale si Fortify rejette le code -->
      <div v-if="erreur.message" class="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold text-center">
        {{ erreur.message }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <input
            class="p-2 border outline-1 w-full rounded-lg text-center text-xl tracking-widest"
            v-model="form.code"
            type="text"
            inputmode="numeric"
            pattern="[0-8]*"
            maxlength="6"
            placeholder="000000"
            id="code"
          />
          <!-- Affichage de l'erreur de validation du champ code -->
          <span v-if="erreur.code" class="text-sm font-semibold text-red-400 block mt-1">
            {{ erreur.code[0] }}
          </span>
        </div>
        
        <div class="mt-6">
          <button
            class="bg-blue-600 text-white p-2 w-full font-semibold rounded-2xl hover:bg-blue-700 transition"
            type="submit"
          >
            Vérification
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { fetchUser } = useAuth();
const { $api } = useNuxtApp();

definePageMeta({
  middleware: ["auth"],
});

// Fortify attend obligatoirement le nom "code"
const form = ref({
  code: "",
});

const erreur = ref({
  code: [],
  message: "",
});

async function handleSubmit() {
  // Réinitialisation des erreurs
  erreur.value = { code: [], message: "" };
  
  try {
    // 1. Initialisation du cookie CSRF (requis par Fortify)
    await $api("/csrf-cookie", { method: "GET" });

    // 2. Envoi du code. Fortify va intercepter et renvoyer un statut 204 si c'est correct
    await $api("/two-factor-challenge", {
      method: "POST",
      body: form.value, // Contient { code: '...' } ou { recovery_code: '...' }
    });

    // 3. Le code est bon (204 reçu) : On rafraîchit l'état de l'utilisateur dans Nuxt
    await fetchUser();
    
    // 4. Redirection manuelle puisque Fortify ne le fait pas pour les requêtes XHR
    navigateTo('/dashboard'); 
    
  } catch (error) {
    // Gestion des erreurs d'authentification (ex: code expiré ou incorrect)
    if (error.response?._data?.errors) {
      erreur.value.code = error.response._data.errors.code || [];
    } else {
      erreur.value.message = error.response?._data?.message || "Code invalide.";
    }
  }
}

</script>
