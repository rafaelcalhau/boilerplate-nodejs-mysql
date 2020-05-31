/* global describe, beforeAll, expect, it */
import request from 'supertest'
import app from '../../src/app'
import User from '../../src/models/User'
import userData from '../data/user.json'

describe('Listing Users on public route', () => {
  beforeAll(async () => {
    await User.destroy({
      where: {},
      truncate: true
    })
  })

  it('should not access a private route without an authorization token', async () => {
    const response = await request(app).get('/api/private/users')
    expect(response.status).toBe(401)
  })

  it('should access public route and create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(userData)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('email')
    expect(response.body.email).toBe(userData.email)
  })

  it('should not access private route and update an user without authorization', async () => {
    const user = await User.findOne({ where: { id: 1 } })
    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .send({ email: 'updated@email.com' })

    expect(response.status).toBe(401)
  })

  it('should access private route and update an user with a valid authorization', async () => {
    const user = await User.findOne({ where: { id: 1 } })
    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .send({ name: 'Rafael C. P. dos Santos' })
      .set({ authorization: `Bearer ${user.generateToken()}` })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('updated')
    expect(response.body.updated).toBeTruthy()
  })

  it('should not access private route and delete an user without a valid authorization', async () => {
    const response = await request(app).delete('/api/users/1')
    expect(response.status).toBe(401)
  })

  it('should an user to authenticate and receive a authorization token', async () => {
    const response = await request(app)
      .post('/api/authenticate')
      .send({ email: userData.email, password: userData.password })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('id')
    expect(response.body.data).toHaveProperty('name')
    expect(response.body).toHaveProperty('token')
  })

  it('should access private route and delete an user with a valid authorization', async () => {
    const user = await User.findOne({ where: { id: 1 } })
    const response = await request(app)
      .delete('/api/users/1')
      .set({ authorization: `Bearer ${user.generateToken()}` })

    expect(response.status).toBe(200)
  })
})
