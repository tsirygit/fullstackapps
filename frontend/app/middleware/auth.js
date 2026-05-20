export default defineNuxtPlugin(async () => {
  const user = useState("user", () => null);

  try {
    const data = await $fetch("http://localhost:8000/api/user", {
      credentials: "include",
    });

    user.value = data;
  } catch {
    user.value = null;
  }
});
