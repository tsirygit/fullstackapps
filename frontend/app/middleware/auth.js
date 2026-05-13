export default defineNuxtRouteMiddleware((to, from) => {
    
  const token = useCookie("XSRF-TOKEN").value;
  
  if (!token) {
    return navigateTo("/auth/login");
  }
  
});
