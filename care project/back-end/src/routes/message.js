const express = require('express')
const router = express.Router()
const { dao, STATUS_CODE } = require('../index')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const multer = require('multer')
const sendMail = require('../util/mail')
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
})
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'care-project/img',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
})

/**
 * @swagger
 * /message/{id_suivi}:
 *   get:
 *     summary: Get message by id_suivi
 *     description: return a message by id_suivi
 *     parameters:
 *      - name : id
 *        description: id of a id_suivi
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the messages by id_suivi
 */
router.get('/:id_suivi', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM message WHERE  id_follow_up = $1  ORDER BY date_time ', [parseInt(req.params.id_suivi)], result => {
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Aucun donnée')
            } else {
                res.statusCode = STATUS_CODE.OK
                res.send(result.rows)
            }
        })
    } catch (error) {
        console.error(error)
        res.send('Error ' + error)
    } finally {
        dao.disconnect()
    }
})

// envoyer un message textcdd
router.post('/send', async (req, res) => {
    const message = req.body
    try {
        await dao.connect()
        await dao.query('INSERT INTO message (contenu, id_follow_up, id_user, is_img, is_video) values ($1,$2, $3, $4, $5 ) returning id', [message.contenu, message.id_follow_up, message.id_user, false, false], result => {
            res.statusCode = STATUS_CODE.UPDATE
            res.end(JSON.stringify(result.rows[0].id))
        })
    } catch (error) {
        console.error(error)
        res.send('Error ' + error)
    } finally {
        dao.disconnect()
    }
})

// envoyer un message file
router.post('/sendFile', upload.single('file'), async (req, res) => {
    let message = req.body.message
    message = JSON.parse(message)
    message.contenu = req.file.location
    console.log(message.contenu)
    try {
        await dao.connect()
        await dao.query('INSERT INTO message (contenu, id_follow_up, id_user, is_img, is_video) values ($1,$2, $3, $4, $5 ) returning id', [message.contenu, message.id_follow_up, message.id_user, message.is_img, false], result => {
            res.statusCode = STATUS_CODE.UPDATE
            const data = [{
                id: result.rows[0].id,
                text: message.contenu
            }]
            res.send(data)
        })
    } catch (error) {
        console.error(error)
        res.send('Error ' + error)
    } finally {
        dao.disconnect()
    }
})

// return last message
router.get('/last-follow-up-message/:id_suivi/:id_message', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM message WHERE  id_follow_up = $1  and id > $2', [parseInt(req.params.id_suivi), parseInt(req.params.id_message)], result => {
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Aucun donnée')
            } else {
                res.statusCode = STATUS_CODE.OK
                res.send(result.rows)
            }
        })
    } catch (error) {
        console.error(error)
        res.send('Error ' + error)
    } finally {
        dao.disconnect()
    }
})

router.delete('/', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.message ', [], result => {
            console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.ERROR_DELETE
                res.send('Cannot delete user')
            } else {
                res.statusCode = STATUS_CODE.DELETED
                res.send('DELETED')
            }
        })
    } catch (err) {
        console.error(err)
        res.send('Error ' + err)
    } finally {
        dao.disconnect()
    }
})
// router.get('/test/sendmail/:email', async (req, res) => {
//     const email = req.params.email
//     sendMail(email, 123456)
//     res.send('INSIDE SEND MESSAGE')
// })
module.exports = router
