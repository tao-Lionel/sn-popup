import { authenticate } from "../shopify.server";
import { json, redirect } from "@remix-run/node";
import { getPopup } from "../models/popup.server";
import { Page, Layout, PageActions } from "@shopify/polaris";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import db from "../db.server";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    return json({
      destination: "product",
      title: "",
    });
  }

  return json(await getPopup(Number(params.id), admin.graphql));
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const data = {
    // ...Object.fromEntries(await request.formData()),
    isActive: true,
    shopId: shop,
    displayTime: new Date(),
  };

  const popup =
    params.id === "new"
      ? await db.popup.create({ data })
      : await db.popup.update({ where: { id: Number(params.id) }, data });

  return redirect(`/app/popup/${popup.id}`);
}

export default function CreatePopup() {
  const popup = useLoaderData();
  const [formState, setFormState] = useState(popup);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState("");

  const createScriptTag = async (accessToken, shop) => {
    const scriptTagData = {
      script_tag: {
        event: "onload",
        src: "https://b5b3-107-167-18-99.ngrok-free.app/popup.js", // 替换为你的 JS 文件 URL
      },
    };

    const response = await fetch(
      `https://${shop}.myshopify.com/admin/api/2024-07/script_tags.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify(scriptTagData),
      },
    );

    const data = await response.json();
    return data;
  };

  async function handleSave() {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://b5b3-107-167-18-99.ngrok-free.app/api/shopify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: "lionel-tao.myshopify.com",
            // accessToken: r,
          }),
        },
      );

      if (response.ok) {
        setToastContent("Email collection popup added to the theme.");
        setShowToast(true);
      } else {
        setToastContent("Failed to add ScriptTag.");
        setShowToast(true);
      }
    } catch (error) {
      setToastContent("Error adding ScriptTag.");
      setShowToast(true);
      console.error("Error adding ScriptTag:", error);
    } finally {
      setIsLoading(false);
    }
    // createScriptTag("e05b82e45778d89b58020da8d5ad4e9d-1725959256", "lionel-tao")
    //   .then((data) => {
    //     console.log("ScriptTag created:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error creating ScriptTag:", error);
    //   });
  }
  return (
    <Page>
      <ui-title-bar title={popup.id ? "编辑弹窗" : "新建弹窗"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          弹窗
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save",
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
