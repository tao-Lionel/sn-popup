import db from "../db.server";

export async function getPopup(id, graphql) {
  const popup = await db.popup.findFirst({ where: { id } })

  if (!popup) {
    return null
  }
  return popup
}

export async function getPopups(shop, graphql) {
  const popups = await db.popup.findMany({
    where: { shopId: shop },
    orderBy: { id: 'desc' }
  })

  if (popups.length === 0) {
    return []
  }

  return popups
}