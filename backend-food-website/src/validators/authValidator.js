import {z} from 'zod'


const checkMailSchema = z.object({
    email: z.string().email()
})


const checkResetPassWordSchema  = z.object({
email: z.string().email(),
token: z.string().length(64),
password: z.string().min(6)
})

export { checkMailSchema,checkResetPassWordSchema }