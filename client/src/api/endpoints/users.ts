import api from "@/api/client";

export const listUsers = () => api.get("/user/users");
