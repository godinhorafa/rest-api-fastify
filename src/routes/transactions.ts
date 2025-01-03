import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import crypto, { randomUUID } from "node:crypto"
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
    app.get(
        '/',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { sessionId } = request.cookies

            const transactions = await knex('transacoes')
                .where('session_id', sessionId)
                .select()

            return { transactions }
        },
    )

    app.get(
        '/:id',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const getTransactionsParamsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = getTransactionsParamsSchema.parse(request.params)

            const { sessionId } = request.cookies

            const transaction = await knex('transacoes')
                .where({
                    session_id: sessionId,
                    id,
                })
                .first()

            return {
                transaction,
            }
        },
    )

    app.get(
        '/summary',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { sessionId } = request.cookies

            const summary = await knex('transacoes')
                .where('session_id', sessionId)
                .sum('amount', { as: 'amount' })
                .first()

            return { summary }
        },
    )

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