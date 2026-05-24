import { prisma } from '../config/db.js';

const getConfirmedOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "ADMIN",
      },
    });

    if (!user)
      return res.status(403).json({
        error: "not authorized user",
      });

    const order = await prisma.order.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "SUCCESSFUL"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        orderItem: {
          include: {
            food: true,
          },
        },
      },
    });

    if (order.length === 0)
      return res.status(404).json({
        status: "error",
        message: "No orders found",
      });

    res.status(200).json({
      status: "successful",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN")
      return res.status(403).json({
        error: "not authorized user",
      });

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItem: true,
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "order not found" });
    }

    let totalPrice = 0;

    existingOrder.orderItem.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });

    const updateOrder = await prisma.order.update({
      where: { id },
      data: {
        totalPrice,
        status: "SUCCESSFUL",
      },
    });

    return res.status(200).json({
      status: "successful",
      data: updateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { getConfirmedOrder, updateAdminStatus };