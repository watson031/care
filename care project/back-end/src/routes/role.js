const express = require('express')
const router = express.Router()
const { dao, STATUS_CODE } = require('../index')

/**
 * @swagger
 * /role:
 *   get:
 *     summary: get roles
 *     description: get all role
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get the roles
 *
 */
router.get('/', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM role', [], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Aucun donnée')
            } else {
                res.statusCode = STATUS_CODE.OK
                res.send(result.rows)
            }
        })
    } catch (err) {
        console.error(err)
        res.send('Error ' + err)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     summary: return a role by id
 *     description: get a role by id
 *     parameters:
 *      - name: "id"
 *        description: id of a row in table role
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get the role id
 *
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await dao.connect()
        await dao.query('SELECT * FROM role WHERE id = $1', [id], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Aucun donnée')
            } else {
                res.statusCode = STATUS_CODE.OK
                res.send(result.rows)
            }
        })
    } catch (err) {
        console.error(err)
        res.send('Error ' + err)
    } finally {
        dao.disconnect()
    }
})

module.exports = router
