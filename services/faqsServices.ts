import { client } from "@/sanity/lib/client";
import { Faqs } from "@/types";

export async function fetchAllFaqs() {
  return await client.fetch(`*[_type == "faqs"]`);
}

export const fetchFaqsById = async (id: string): Promise<Faqs | null> => {
  const query = `*[_type == "faqs" && _id == $id][0]{
    _id,
    question,
    answer
  }`;
  const params = { id };
  const faqs = await client.fetch(query, params);
  return faqs;
};
