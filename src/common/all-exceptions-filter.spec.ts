import { HttpException } from '@nestjs/common'
import { AllExceptionsFilter } from './all-exceptions-filter'

describe('AllExceptionsFilter', () => {
    const filter = new AllExceptionsFilter()

    const mockJsonFun = jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockStatusFun = jest.fn((_) => ({
        json: mockJsonFun,
    }))
    const mockHost = {
        switchToHttp() {
            return {
                getResponse: () => ({
                    status: mockStatusFun,
                }),
            }
        },
    }

    it('transforms HttpException', () => {
        const err = new HttpException('Boom', 666)

        filter.catch(err, mockHost as any)

        expect(mockStatusFun).toBeCalledWith(666)
        expect(mockJsonFun).toBeCalledWith({
            error: {
                code: 666,
                message: 'Boom',
            },
        })
    })

    it('transforms unknown error', () => {
        const err = new Error('Oops')

        filter.catch(err, mockHost as any)

        expect(mockStatusFun).toBeCalledWith(500)
        expect(mockJsonFun).toBeCalledWith({
            error: {
                code: 500,
                message: 'Internal server error',
            },
        })
    })
})
