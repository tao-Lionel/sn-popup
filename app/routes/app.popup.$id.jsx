import { authenticate } from "../shopify.server";
import { json, redirect } from "@remix-run/node";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    return json({
      destination: "product",
      title: "",
    });
  }

  // return json(await getQRCode(Number(params.id), admin.graphql));
}
