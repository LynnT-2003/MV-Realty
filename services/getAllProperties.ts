import { client } from "@/sanity/lib/client";

export default async function getAllBlogs() {
  const query = `
  *[_type == "property"]`;

  const data = await client.fetch(query);

  return data;
}
