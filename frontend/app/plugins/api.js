export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: "include",

    async onRequest({ options }) {
      
      const token = useCookie("XSRF-TOKEN");

      if (token.value) {
        options.headers = {
          ...options.headers,
          Accept: "application/json",
          "X-XSRF-TOKEN": token.value,
        };
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
