import { z } from "zod";

const addFoodValidator = z.object({
  name: z.string(),
  image: z.string(),
  price: z.number(),
  quantity: z.number(),
});

const updateFoodValidator = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
});

const searchValidator = z.object({
  name: z.string(),
});


const foodQuantity = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive()
})


export { addFoodValidator, updateFoodValidator, searchValidator,foodQuantity };
