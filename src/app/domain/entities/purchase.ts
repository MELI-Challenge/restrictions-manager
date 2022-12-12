export interface Seller {
  id: number
  nickname: string
}

export interface Price {
  total: number
  currency: string
}

export interface Purchase {
  id: number
  title: string
  price: Price
  quantity: number
  date: string
  imageUrl: string
  seller: Seller
  transactionId: number
  shipmentId: number
}
