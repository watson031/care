const express = require('express')
const router = express.Router()
const { dao, STATUS_CODE } = require('../index')

/**
 * @swagger
 * /service/establishment/{id_establishment}:
 *   get:
 *     summary: return all services by establishment
 *     description: return all services by establishment
 *     parameters:
 *      - name : id_establishment
 *        description: id of an establishment
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the services
 */
router.get('/establishment/:id_establishment', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.service WHERE id_etablishment = $1', [parseInt(req.params.id_establishment)], result => {
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.end(null)
            } else {
                res.send(result.rows)
            }
        })
    } catch (error) {
        res.send(error)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /service/{id}:
 *   get:
 *     summary: Get service by id
 *     description: return a service by id
 *     parameters:
 *      - name : id
 *        description: id of a service
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the service
 */
router.get('/:id', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.service WHERE id = $1', [parseInt(req.params.id)], result => {
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.end(null)
            } else {
                res.send(result.rows)
            }
        })
    } catch (error) {
        res.send(error)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /service:
 *   post:
 *     summary: Add a new service
 *     description: Add a service
 *     parameters:
 *      - name : description
 *        description: description of a service
 *        in: "formData"
 *        require: true
 *        type: string
 *      - name : id_etablishment
 *        description: id of an establishment
 *        in: "formData"
 *        require: true
 *        type: integer
 *        format: int64
 *     responses:
 *       201:
 *         description: The service is added
 *       444:
 *          description: Cannot add the service
 */
router.post('/', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('INSERT INTO public.service (description, id_etablishment) values ($1, $2) returning id', [req.body.description, req.body.id_etablishment], result => {
            res.statusCode = STATUS_CODE.UPDATE
            res.send({
                id: result.rows[0].id,
                description: req.body.description
            })
        })
    } catch (error) {
        res.statusCode = STATUS_CODE.ERROR_UPDATE
        res.send(error)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /service/{id}:
 *   put:
 *     summary: update a service
 *     description: update a service
 *     parameters:
 *      - name : id
 *        description: id of the service
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *          description: Cannot update the service
 */
router.put('/:id', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('UPDATE public.service SET description = $1, id_etablishment = $2 WHERE id = $3', [req.body.description, parseInt(req.body.id_etablishment), parseInt(req.params.id)], result => {
            res.statusCode = STATUS_CODE.UPDATE
            res.end(true)
        })
    } catch (error) {
        res.statusCode = STATUS_CODE.ERROR_UPDATE
        res.send(error)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /service/{id}:
 *   delete:
 *     summary: Delete a service
 *     description: Delete a service
 *     parameters:
 *      - name : id
 *        description: id of a service
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       222:
 *         description: Success
 *       409:
 *          description: Cannot delete the service
 */
router.delete('/:id', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.service WHERE  id = $1', [parseInt(req.params.id)], result => {
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
            } else {
                console.log('DELETED')
                res.statusCode = STATUS_CODE.DELETED
                res.send('DELETED')
            }
        })
    } catch (error) {
        res.statusCode = STATUS_CODE.ERROR_DELETE
        res.send(error)
    } finally {
        dao.disconnect()
    }
})
module.exports = router
