/* global describe, expect, it */
import * as Utils from '../../src/modules/utils'

describe('Testing util functions', () => {
  it('should handleCatchedError return an error as a JSON string', async () => {
    function ResMock () {
      let statusCode = 200

      this.json = function (data) {
        return { status: statusCode, data }
      }

      this.status = function (code) {
        statusCode = code
        return this
      }
    }

    let response
    const res = new ResMock()

    response = Utils.handleCatchedError(res, 'This is just a test.')
    expect(response.status).toBe(500)

    response = Utils.handleCatchedError(res, 'This is just a test.', 401)
    expect(response.status).toBe(401)
  })
})
