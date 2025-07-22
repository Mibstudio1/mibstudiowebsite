import { CreateCustomerProps } from "@/type/customerType";
import { prisma } from "@/utils/db";

export async function findCustomerByCustomerId(customerId: string) {
  return await prisma.customer.findUnique({
    where: { customerId },
  });
}

export async function createNewCustomer(value: CreateCustomerProps) {
  const { customerName, companyName, phone, address, customerId } = value;
  return await prisma.customer.create({
    data: {
      name: customerName,
      company: companyName,
      phone,
      address,
      customerId,
    },
  });
}

export async function editCustomer(value: CreateCustomerProps) {
  const { customerName, companyName, phone, address, customerId } = value;
  return await prisma.customer.update({
    where: { customerId },
    data: {
      name: customerName,
      company: companyName,
      phone,
      address,
    },
  });
}
