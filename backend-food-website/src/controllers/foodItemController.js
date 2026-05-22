import { prisma } from "../config/db.js";

// needs authorization and bearer
const addFoodItems = async (req, res) => {
  const { name, image, price, quantity } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Only admin can create food items",
    });
  }

  const addFood = await prisma.food.create({
    data: {
      name,
      image,
      price,
      quantity,
      createdById: req.user.id,
    },
  });

  res.status(201).json({
    status: "successful",
    data: addFood,
  });
};

const updateFoodItems = async (req, res) => {
  const { name, image, price, quantity } = req.body;
  const id = req.params.id;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Only admin can update food items",
    });
  }

  const food = await prisma.food.findUnique({
    where: { id },
  });

  if (!food) {
    return res.status(404).json({
      error: "Food item not found",
    });
  }

  const update = {};

  if (name !== undefined) update.name = name;
  if (image !== undefined) update.image = image;
  if (price !== undefined) update.price = price;
  if (quantity !== undefined) update.quantity = quantity;

  const updateItems = await prisma.food.update({
    where: { id },
    data: update,
  });

  res.status(200).json({
    status: "success",
    data: updateItems,
  });
};

const deleteFoodItem = async (req, res) => {
  const id = req.params.id;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Only admin can delete food items",
    });
  }

  const food = await prisma.food.findUnique({
    where: { id },
  });

  if (!food) {
    return res.status(404).json({
      error: "Food not found",
    });
  }

  const deleteItems = await prisma.food.delete({
    where: { id },
  });

  res.status(200).json({
    status: "Food item deleted successfully",
    data: deleteItems,
  });
};
// api below fetched
const getFoodItems = async (req, res) => {
  const foodItems = await prisma.food.findMany();

  res.status(200).json({
    status: "food Items gotten successfully",
    data: foodItems,
  });
};

const searchFoodItems = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Search name is required",
    });
  }
  const getName = await prisma.food.findMany({
    where: {
      name: {
        contains: name.toLowerCase(),
      },
    },
  });
  res.status(200).json({
    status: "search was successful",
    data: getName,
  });
};

export {
  addFoodItems,
  updateFoodItems,
  deleteFoodItem,
  getFoodItems,
  searchFoodItems,
};
