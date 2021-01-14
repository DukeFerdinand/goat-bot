import { Firestore } from '@google-cloud/firestore'
import { dbConnection } from '../db'

interface ShoppingListItem {
  name: string
  count: number
  complete: boolean
}

interface ShoppingList {
  id: string
  complete: boolean
  name: string
  items: Array<ShoppingListItem>
}

export class ShopConnection {
  private db: Firestore

  constructor() {
    this.db = dbConnection()
  }

  public async newList(name: string): Promise<ShoppingList> {
    const doc = this.db.collection('shopping-lists').doc()
    const data: Omit<ShoppingList, 'items'> = {
      id: doc.id,
      complete: false,
      name,
    }

    try {
      await doc.create(data)
      return {
        ...data,
        items: [],
      }
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }

  public async getList(name: string): Promise<ShoppingList | undefined> {
    const search = await this.db
      .collection('shopping-lists')
      .where('name', '==', name)
      .get()

    if (!search.empty) {
      const list = search.docs[0]
      const items = await this.db
        .collection('shopping-list')
        .doc(list.id)
        .collection('items')
        .get()

      const response = {
        ...(list.data() as ShoppingList),
        id: list.id,
      }

      return items.empty
        ? {
            ...response,
            items: [],
          }
        : {
            ...response,
            items: items.docs.map((doc) => ({
              ...(doc.data() as Omit<ShoppingListItem, 'id'>),
              id: doc.id,
            })),
          }
    }
  }

  public async getAllLists(): Promise<ShoppingList[]> {
    const search = await this.db.collection('shopping-lists').get()

    if (!search.empty) {
      return search.docs.map((doc) => ({
        ...(doc.data() as Omit<ShoppingList, 'id' | 'items'>),
        id: doc.id,
        items: [],
      }))
    }
    return []
  }
}
