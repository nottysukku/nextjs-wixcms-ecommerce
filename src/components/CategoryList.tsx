import { wixClientServer } from "@/lib/wixClientServer";
import CategoryListClient from "./CategoryListClient";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return <CategoryListClient categories={cats.items} />;
};

export default CategoryList;
