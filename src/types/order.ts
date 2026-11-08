import { OrderStatus } from "@prisma/client";

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  image: string,
  imageThumbnail: string,
};

export type Order = {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  scheduledAt:string;
  customer: {
    name: string | null;
    phone: string;
  } | null;

  payment: {
    method: string;
    status: string;
  } | null;

  delivery: {
    method: string;
    address: string | null;
  } | null;

  items: OrderItem[];
};

export type OrderK = {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;

  customer: {
    name: string | null |  undefined;
    phone: string |  undefined;
  } | null;

  payment: {
    method: string | undefined;
    status: string |  undefined;
  } | null;

  delivery: {
    method: string |  undefined;
    address: string | null |  undefined;
  } | null;

  items: OrderItem[];
};



export type CartItemDTO = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CreateOrderDTO = {
  customerId?: string;
  name: string;
  phone:string
  items: CartItemDTO[];

  paymentMethod: "CASH" | "CARD";
  deliveryMethod: "DELIVERY" | "PICKUP";

  address?: string;
};


