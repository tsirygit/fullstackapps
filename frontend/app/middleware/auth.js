export default defineNuxtRouteMiddleware(async () => {

  try {

    const { data } = await useFetch('http://localhost:8000/api/user', {
      credentials: 'include',
    });

    if (!data.value) {
      return navigateTo('/auth/login');
    }

  } catch (e) {
    return navigateTo('/auth/login');
  }

});