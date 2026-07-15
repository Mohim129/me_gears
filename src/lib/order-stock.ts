import { ObjectId, type Db } from 'mongodb';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export function getStockDelta(previousStatus?: string, nextStatus?: string): number {
  if (!previousStatus || !nextStatus || previousStatus === nextStatus) {
    return 0;
  }

  if (previousStatus !== 'Cancelled' && nextStatus === 'Cancelled') {
    return 1;
  }

  if (previousStatus === 'Cancelled' && nextStatus !== 'Cancelled') {
    return -1;
  }

  return 0;
}

export function getProductLookupFilter(productId: string) {
  if (ObjectId.isValid(productId) && String(new ObjectId(productId)) === productId) {
    return { _id: new ObjectId(productId) };
  }

  return { id: productId };
}

export async function adjustOrderItemStock(
  db: Db,
  items: Array<{ productId: string; quantity?: number }>,
  delta: number
) {
  if (delta === 0 || !items?.length) {
    return;
  }

  for (const item of items) {
    const quantity = Number(item.quantity || 1);
    const filter = getProductLookupFilter(item.productId);
    const product = await db.collection('products').findOne(filter);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const currentStock = Number(product.stock ?? 0);
    const nextStock = currentStock + delta * quantity;

    if (delta < 0 && nextStock < 0) {
      throw new Error(`Insufficient stock for ${product.name || item.productId}`);
    }

    await db.collection('products').updateOne(
      filter,
      { $set: { stock: nextStock, updatedAt: new Date() } }
    );
  }
}
