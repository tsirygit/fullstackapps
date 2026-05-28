export const useAuth = () => {
  const user = useState("user", () => null);

  const fetchUser = async () => {
    try {
      const data = await $fetch("http://localhost:8000/api/user", {
        credentials: "include",
      });

      user.value = data;

      return data;
      
    } catch {
      user.value = null;
    }
  };

  return {
    user,
    fetchUser,
  };
};
