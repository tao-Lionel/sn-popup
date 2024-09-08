import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  EmptyState,
  IndexTable,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {getPopups} from '../models/popup.server'


export const loader = async ({ request }) => {
  const {admin,session} =await authenticate.admin(request);

  const popups = await getPopups(session.shop,admin.graphql)

  return json({
    popups,
  });
};

// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
//   const color = ["Red", "Orange", "Yellow", "Green"][
//     Math.floor(Math.random() * 4)
//   ];
//   const response = await admin.graphql(
//     `#graphql
//       mutation populateProduct($input: ProductInput!) {
//         productCreate(input: $input) {
//           product {
//             id
//             title
//             handle
//             status
//             variants(first: 10) {
//               edges {
//                 node {
//                   id
//                   price
//                   barcode
//                   createdAt
//                 }
//               }
//             }
//           }
//         }
//       }`,
//     {
//       variables: {
//         input: {
//           title: `${color} Snowboard`,
//         },
//       },
//     },
//   );
//   const responseJson = await response.json();
//   const product = responseJson.data.productCreate.product;
//   const variantId = product.variants.edges[0].node.id;
//   const variantResponse = await admin.graphql(
//     `#graphql
//     mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//       productVariantsBulkUpdate(productId: $productId, variants: $variants) {
//         productVariants {
//           id
//           price
//           barcode
//           createdAt
//         }
//       }
//     }`,
//     {
//       variables: {
//         productId: product.id,
//         variants: [{ id: variantId, price: "100.00" }],
//       },
//     },
//   );
//   const variantResponseJson = await variantResponse.json();

//   return json({
//     product: responseJson.data.productCreate.product,
//     variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
//   });
// };

const EmptyPopupState = ({ onAction }) => (
  <EmptyState
    heading="新建弹窗"
    action={{
      content: "新建弹窗",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>我是新建弹窗的说明 </p>
  </EmptyState>
);

const PopupTable = ({ popups }) => (
  <IndexTable
    headings={[
      { title: "Thumbnail", hidden: true },
      { title: "Title" },
      { title: "Product" },
      { title: "Date created" },
      { title: "Scans" },
    ]}
    selectable={false}
  >
    {/* {qrCodes.map((qrCode) => (
      <PopupTableRow key={qrCode.id} qrCode={qrCode} />
    ))} */}
  </IndexTable>
);

export default function Index() {
  const { popups } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="SN Popup">
        <button variant="primary" onClick={() => navigate("/app/popup/new")}>
        新建弹窗
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {popups.length === 0 ? (
              <EmptyPopupState onAction={() => navigate("popup/new")} />
            ) : (
              <PopupTable popups={popups} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
