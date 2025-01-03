import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import crypto, { randomUUID } from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const transactions = await knex('transacoes').select()

        return { transactions }
    })

    app.get('/:id', async (request) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(request.params)

        const transaction = await knex('transacoes').where('id', id).first()

        return { transaction }
    })

    app.get('/summary', async () => {
        const summary = await knex('transacoes')
            .sum('amount', { as: 'amount' })
            .first()
        return { summary }
    })

    app.post('/', async (request, reply) => {
        // {title, amount, type: credit or debit}
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = createTransactionBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId
        if (!sessionId) {
            sessionId = randomUUID()
            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            })
        }

        await knex('transacoes').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId
        })

        return reply.status(201).send()
    })
}