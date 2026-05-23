const getConfirmedOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "ADMIN",
      },
    });

    if (!user) {
      return res.status(403).json({
        error: "not authorized user",
      });
    }

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

    if (order.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No orders found",
      });
    }

    return res.status(200).json({
      status: "successful",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
