const aws = require('aws-sdk')
const express = require('express')
const multerS3 = require('multer-s3')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
// const path = require('path')
const { dao, STATUS_CODE, ROLE } = require('../index')
const multer = require('multer')
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
 * /establishement:
 *   post:
 *     summary: Add a new establishement (name unique)
 *     description: Add a establishement
 *     responses:
 *       201:
 *         description: The establishement is added
 *       444:
 *          description: Cannot add the establishement because name is already in use with us
 */
router.post('/', upload.single('file'), async (req, res) => {
    let establishment = req.body.establishment
    console.log(req.file.location)
    // res.send(req.file.location)

    // upload(req, res, function (err) {
    //     if (err) {
    //         // An unknown error occurred when uploading.
    //         res.send(STATUS_CODE.UPLOAD_ERROR)
    //     }

    //     // Everything went fine.
    // })

    // console.log(JSON.parse(establishment))
    establishment = JSON.parse(establishment)

    await dao.connect()
    try {
        await dao.query('INSERT INTO public.establishment(name, description, logo_url, phone, email, adress)' +
        'VALUES ($1, $2, $3, $4, $5,$6) RETURNING id AS id_establishment', [establishment.name,
            establishment.description, req.file.location, establishment.phone, establishment.email, establishment.adress],
        result => {
            res.statusCode = STATUS_CODE.UPDATE
            establishment.id = result.rows[0].id_establishment
            res.send(establishment)
        })
    } catch (error) {
        res.send(error)
        res.send(STATUS_CODE.ERROR_UPDATE)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /establishment:
 *   get:
 *     summary: return a list of establishments
 *     description: Get all establishments
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get list of establishments
 */
router.get('/', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.establishment', [], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find establishments')
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

router.delete('/' + process.env.ACCESS_CODE + '/:id', async (req, res) => {
    const id = req.params.id
    console.log('mon id :' + id)
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.establishment where id =$1 ', [parseInt(id)], result => {
            // console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                console.log('Not found')
                res.send('Cannot delete user')
            } else {
                console.log('DELETED')
                res.statusCode = STATUS_CODE.OK
            }
        })
    } catch (err) {
        console.error(err)
        res.send('Error detete ' + err)
    } finally {
        dao.disconnect()
    }
})

/**
 * Delete all establishments, not accessible to anyone
 * process.env.MY_KEY_DELETE = secret route known only by the admin of an establishment
 */
router.delete('/' + process.env.ACCESS_CODE, async (req, res) => {
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.establishment', [], result => {
            // console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
            } else {
                console.log('DELETED')
                res.statusCode = STATUS_CODE.OK
            }
        })
    } catch (err) {
        console.error(err)
        res.send('Error delete all etablishments ' + err)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /establishment/admin:
 *   put:
 *     summary: Add a admin (establishment)
 *     description: add admin for establishment
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *          description: Cannot update info of the patient
 */
router.post('/admin', async (req, res) => {
    const admin = req.body.admin
    const idEstablishment = req.body.idEstablishment
    console.log(admin)
    bcrypt.hash(admin.password, saltRounds, async (err, hash) => {
        if (err) {
            res.statusCode = 500
            res.send(err)
        }
        try {
            await dao.connect()
            await dao.query('INSERT INTO public."user"("firstName", "lastName", email, password, id_role )' +
            'VALUES ($1, $2, $3, $4, $5) RETURNING id AS id_admin', [admin.firstName, admin.lastName, admin.email, hash, ROLE.ADMIN], async result => {
                console.log(result)
                if (result.rowCount === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('Cannot add the admin')
                } else {
                    await dao.query('INSERT INTO public.user_establishment(id_etablishment, id_user)' +
                    'VALUES ($1, $2) RETURNING id', [idEstablishment, result.rows[0].id_admin], result => {
                        res.statusCode = STATUS_CODE.UPDATE
                        res.send(true)
                        dao.disconnect()
                    }).catch(err => { console.log(err); res.send(err) })
                }
            })
        } catch (err) {
            console.error(err)
            res.send('Error ' + err)
            dao.disconnect()
        }
    })
})

/**
 * Delete all user_establishments, not accessible to anyone
 */
router.delete('/user_establishment', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.user_establishment', [], result => {
            // console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
            } else {
                console.log('DELETED')
                res.statusCode = STATUS_CODE.OK
            }
        })
    } catch (err) {
        console.error(err)
        res.send('Error delete user_establishment' + err)
    } finally {
        dao.disconnect()
    }
})

/**
 * Delete all user_establishments, not accessible to anyone
 */
router.delete('/user_establishment/:id', async (req, res) => {
    const id = req.params.id
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.user_establishment WHERE id_user =$1 ', [parseInt(id)], result => {
            // console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
            } else {
                console.log('DELETED')
                res.statusCode = STATUS_CODE.OK
            }
        })
    } catch (err) {
        console.error(err)
        res.send('Error delete user_establishment' + err)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /establishment/{id_user}:
 *   get:
 *     summary: return all establishment where user active
 *     description: All establishment where user active
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get list of reps
 */
router.get('/:id_user', async (req, res) => {
    const query = 'SELECT public.establishment.* FROM public.establishment ' +
    'INNER JOIN public.service ON public.establishment.id = id_etablishment ' +
    'INNER JOIN public.follow_up ON public.service.id = id_service ' +
    'WHERE is_actif = $1 AND id_user = $2'
    console.log(query)
    try {
        await dao.connect()
        await dao.query(query,
            [true, parseInt(req.params.id_user)], result => {
                console.log(result)
                if (result.rows.length === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('cannot find establishments')
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

// get user by establishment
router.get('/user/:id', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.user_establishment where id_user= $1', [req.params.id], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find id_establishment')
            } else {
                res.statusCode = STATUS_CODE.OK
                res.send(result.rows[0])
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
