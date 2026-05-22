import { prisma } from "./config/db.js";

const userId = process.env.ADMIN_ID;

const foodProducts = [
  {
    name: "Burger",
    image: "foodImages/burger.jgp.jpg",
    price: 2000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Doughnut",
    image: "foodImages/doughnut.jpg",
    price: 1500,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Fried Meat",
    image: "foodImages/fried.jpg",
    price: 5000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Ice cream",
    image: "foodImages/ice-cream.jpg",
    price: 2000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Jollof",
    image: "foodImages/jollof.jpg",
    price: 3000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Pasta",
    image: "foodImages/pasta.jpg",
    price: 2000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Pizza",
    image: "foodImages/pizza.jpg",
    price: 6000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Salad",
    image: "foodImages/salad.jpg",
    price: 2000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Sandwich",
    image: "foodImages/sandwich.jpg",
    price: 2000,
    quantity: 1,
    createdById: userId,
  },
  {
    name: "Sushi",
    image: "foodImages/sushi.jgp.jpg",
    price: 2000,
    quantity: 1,
    createdById: userId,
  },
];

const main = async () => {
  console.log("running seeding file");
  for (const foodProduct of foodProducts) {
    await prisma.food.create({
      data: foodProduct,
    });
    console.log(`food items created successfully: ${foodProduct.name}`);
  }

  console.log("seeding completed");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit();
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
