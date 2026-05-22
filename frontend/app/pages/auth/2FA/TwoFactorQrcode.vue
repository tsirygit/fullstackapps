<template>
     <h1>
          two factor authentication
     </h1>
</template>


<script setup>
 
const { $api } = useNuxtApp();

const { fecthUser } = useAuth();


async function twoFactorQrCode() {
       
   await fecthUser();

   try {
      
     const response = await $api("/api/user/two-factor-qr-code ", {
      method: "GET"
     })

   } catch (error) {
      
   }
}


</script>