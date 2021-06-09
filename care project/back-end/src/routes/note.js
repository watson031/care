const express = require('express')
const router = express.Router()
const { dao, STATUS_CODE } = require('../index')

/**
 * @swagger
 * /note:
 *   post:
 *     summary: Add a new note
 *     description: Add a note
 *     responses:
 *       201:
 *         description: The note is added
 *       404:
 *          description: cannot added the note
 */
router.post('/', async (req, res) => {
    const note = req.body
    console.log(note)
    try {
        await dao.connect()
        await dao.query('INSERT INTO public.note (description ,id_user)' +
            'VALUES ($1, $2) returning id', [note.description, note.id_user], async result => {
            console.log(result)
            console.log(result.rowCount)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('note cannot be added')
            } else {
                res.statusCode = STATUS_CODE.UPDATE
                res.send({
                    id: result.rows[0].id,
                    description: note.description,
                    id_user: note.id_user
                })
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
 * /note/{id_user}:
 *    get:
 *     summary: return a note
 *     description: Get a note
 *     parameters:
 *      - name : id_user
 *        description: id of a user
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the note
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.note WHERE id_user = $1', [parseInt(id)], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find the note')
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
 * /note/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Delete a note
 *     parameters:
 *      - name : id
 *        description: id of a note
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       222:
 *         description: Success
 *       409:
 *          description: Cannot delete the note
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.note WHERE id = $1', [parseInt(id)], result => {
            console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.ERROR_DELETE
                res.send('Cannot delete note')
            } else {
                res.statusCode = STATUS_CODE.DELETED
                res.send('Deleted')
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
