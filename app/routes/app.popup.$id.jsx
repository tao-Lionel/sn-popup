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

  async function handleSave() {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://ae72-104-194-206-225.ngrok-free.app/api/add-script-tag",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
