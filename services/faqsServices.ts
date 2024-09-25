import { client } from "@/sanity/lib/client";
import { Faqs, PropertyFaqs, Property} from "@/types";


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

export async function fetchAllPropertyFaqsByPropertyId(propertyId: string): Promise<{ question: PropertyFaqs; answer: string }[]> {
  const query = `*[_type == "property" && _id == $propertyId][0]{
      propertyFaqs[] {
          question->{_id, question},
          answer
      }
  }`;

  const params = { propertyId };
  const result = await client.fetch(query, params);
  
  return result?.propertyFaqs || []; // Ensure returning an array of PropertyFaqs
}


