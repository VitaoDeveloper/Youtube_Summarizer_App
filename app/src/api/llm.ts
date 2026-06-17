import { apiClient } from "./client";

export async function getProviders() {
    const { data } = await apiClient.get<string[]>('/llm/providers');
    return data;
}