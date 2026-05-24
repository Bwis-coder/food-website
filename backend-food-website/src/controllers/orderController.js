import { prisma } from "../config/db.js";

const getOrderByUser = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
        status: "CONFIRMED",
      },
      include: {
        user: true,
        orderItem: {
          include: {
            food: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order) => {
      let totalPrice = 0;

      order.orderItem.forEach((item) => {
        totalPrice += item.quantity * item.food.price;
      });

      return {
        ...order,
        totalPrice,
      };
    });

    return res.status(200).json({
      status: "successful",
      data: formattedOrders,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getOrderItem = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    let orderItems;

    if (user.role === "ADMIN") {
      orderItems = await prisma.orderItem.findMany({
        include: {
          food: { include: { createdBy: true } },
          order: true,
        },
      });
    } else if (user.role === "USER") {
      orderItems = await prisma.orderItem.findMany({
        where: {
          order: { userId: req.user.id, status: "PENDING" },
        },
        include: {
          food: true,
          order: true,
        },
      });
    } else {
      return res.status(404).json({ error: "user not found" });
    }

    return res.status(200).json({
      status: "getting user order Items successful",
      data: orderItems,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteItems = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("DELETE ROUTE HIT");

    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!orderItem) {
      return res.status(404).json({ error: "item not found" });
    }

    if (orderItem.order.userId !== req.user.id) {
      return res.status(403).json({ error: "not allowed" });
    }

    if (orderItem.order.status !== "PENDING") {
      return res.status(400).json({
        error: "Cannot delete from confirmed order",
      });
    }

    const deleteOrderItem = await prisma.orderItem.delete({
      where: { id },
    });

    await prisma.order.update({
      where: { id: orderItem.orderId },
      data: {
        totalPrice: {
          decrement: orderItem.price * orderItem.quantity,
        },
      },
    });

    return res.status(200).json({
      status: "food order deleted successfully",
      data: { deleteOrderItem },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const addFoodQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      let order = await tx.order.findFirst({
        where: { userId, status: "PENDING" },
      });

      if (!order) {
        order = await tx.order.create({
          data: {
            userId,
            status: "PENDING",
            totalPrice: 0,
          },
        });
      }

      const food = await tx.food.findUnique({ where: { id } });

      if (!food) {
        throw new Error("food not found");
      }

      const orderItem = await tx.orderItem.findUnique({
        where: {
          orderId_foodId: {
            foodId: food.id,
            orderId: order.id,
          },
        },
      });

      let updateItem;

      if (orderItem) {
        updateItem = await tx.orderItem.update({
          where: { id: orderItem.id },
          data: {
            quantity: orderItem.quantity + quantity,
            price: food.price,
          },
        });
      } else {
        updateItem = await tx.orderItem.create({
          data: {
            quantity,
            price: food.price,
            orderId: order.id,
            foodId: id,
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          totalPrice: {
            increment: food.price * quantity,
          },
        },
      });

      return updateItem;
    });

    return res.status(200).json({
      status: "successful",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!orderItem) {
      return res.status(404).json({ error: "no item found" });
    }

    if (orderItem.order.userId !== req.user.id) {
      return res.status(403).json({ error: "not allowed" });
    }

    if (orderItem.order.status !== "PENDING") {
      return res.status(400).json({
        error: "Cannot update confirmed order",
      });
    }

    const updateOrderItem = await prisma.orderItem.update({
      where: { id },
      data: {
        quantity: { increment: 1 },
      },
    });

    await prisma.order.update({
      where: { id: updateOrderItem.orderId },
      data: {
        totalPrice: {
          increment: orderItem.price,
        },
      },
    });

    return res.status(200).json({
      status: "item update successful",
      data: updateOrderItem,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItem: { include: { food: true } },
      },
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Not allowed",
      });
    }

    if (order.orderItem.length === 0) {
      return res.status(400).json({
        message: "Cannot place empty order",
      });
    }

    let totalPrice = 0;
    order.orderItem.forEach((item) => {
      totalPrice += item.quantity * item.food.price;
    });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: "CONFIRMED",
        totalPrice,
      },
      include: {
        orderItem: { include: { food: true } },
      },
    });

    return res.status(200).json({
      status: "successful",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export {
  getOrderItem,
  getOrderByUser,
  deleteItems,
  addFoodQuantity,
  updateOrderItem,
  placeOrder,
};
