const express = require('express')
const router = express.Router()
const { dao, STATUS_CODE, ROLE } = require('../index')
const sendMail = require('../util/mail')
const IS_USER_ACTIVE = true
const bcrypt = require('bcrypt')
const saltRounds = 10
/**
 * @swagger
 * /medical-follow-up:
 *   get:
 *     summary: return a list of medical-follow-up
 *     description: Get all medical-follow-ups
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get list of medical-follow-ups
 */
router.get('/', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.follow_up', [], result => {
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
 * /medical-follow-up/{id}:
 *   get:
 *     summary: Get medical-follow-up by id
 *     description: return a medical-follow-up by id
 *     parameters:
 *      - name : id
 *        description: id of a medical-follow-up
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the medical-follow-up
 */
router.get('/:id', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.follow_up WHERE id = $1', [parseInt(req.params.id)], result => {
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
 * /medical-follow-up/access-code:
 *   post:
 *     summary: Add a new medical-follow-up
 *     description: Add a medical-follow-up
 *     responses:
 *       201:
 *         description: The medical-follow-up is added
 *       444:
 *          description: Cannot add the medical-follow-up
 */
router.post('/access-code', async (req, res) => {
    console.log(req.body)
    try {
        await dao.connect()
        await dao.query('INSERT INTO public."user" (email, access_code, id_role) VALUES ($1, $2, $3) RETURNING id AS id_user',
            [req.body.email, req.body.access_code, ROLE.PATIENT], async result1 => {
                await dao.query('INSERT INTO public.follow_up (id_user,is_actif, id_service, treatment_description) VALUES ($1, $2, $3, $4) RETURNING id AS id_suivi',
                    [parseInt(result1.rows[0].id_user), true, req.body.id_service, req.body.treatment_description], result2 => {
                        dao.query('INSERT INTO public.user_establishment (id_etablishment, id_user) VALUES ($1, $2) ',
                            [req.body.id_establishment, parseInt(result1.rows[0].id_user)], result3 => {
                                res.statusCode = STATUS_CODE.UPDATE
                                // console.log(result1[0])
                                dao.disconnect()
                                req.body.id = result1.rows[0].id_user
                                // userEmail : medical.follow.up.ca@gmail.com, accessCode : req.body.access_code
                                sendMail(req.body.email, req.body.access_code)
                                res.send(JSON.stringify({
                                    id: result2.rows[0].id_suivi,
                                    idUser: result1.rows[0].id_user,
                                    idService: req.body.id_service
                                }))
                            })
                    }).catch(error => { console.log(error); res.send(error); dao.disconnect() })
            })
    } catch (error) {
        res.statusCode = STATUS_CODE.ERROR_UPDATE
        console.log(error)
        res.send('Error ' + error)
    }
})
// add follow-up without acces code
router.post('/patient', async (req, res) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
            res.send(err)
        }
        try {
            // hash du mot de passe
            await dao.connect()
            await dao.query('INSERT INTO public."user" ("firstName", "lastName", date_of_birth, phone, email, password, is_actif, id_role, id_sexe)' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id as id_user',
            [req.body.firstName, req.body.lastName, req.body.date_of_birth, req.body.phone, req.body.email, hash, IS_USER_ACTIVE, ROLE.PATIENT, req.body.id_sexe], async result1 => {
                await dao.query('INSERT INTO public.follow_up (id_user,is_actif, id_service, treatment_description) VALUES ($1, $2, $3, $4) RETURNING id AS id_suivi',
                    [parseInt(result1.rows[0].id_user), true, req.body.id_service, req.body.treatment_description], result2 => {
                        dao.query('INSERT INTO public.user_establishment (id_etablishment, id_user) VALUES ($1, $2) ',
                            [req.body.id_establishment, parseInt(result1.rows[0].id_user)], result3 => {
                                res.statusCode = STATUS_CODE.UPDATE
                                // console.log(result1[0])
                                dao.disconnect()
                                req.body.id = result1.rows[0].id_user
                                res.send(JSON.stringify({
                                    id: result2.rows[0].id_suivi,
                                    idUser: result1.rows[0].id_user,
                                    idService: req.body.id_service
                                }))
                                // userEmail : medical.follow.up.ca@gmail.com, accessCode : req.body.access_code
                                sendMail('medical.follow.up.ca@gmail.com', req.body.access_code)
                            })
                    }).catch(error => { console.log(error); res.send(error); dao.disconnect() })
            })
        } catch (error) {
            res.statusCode = STATUS_CODE.ERROR_UPDATE
            console.log(error)
            res.send('Error ' + error)
        }
    })
})

/**
 * @swagger
 * /medical-follow-up/{id}:
 *   delete:
 *     summary: Delete a medical-follow-up
 *     description: Delete a medical-follow-up
 *     parameters:
 *      - name : id
 *        description: id of a medical-follow-up
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       222:
 *         description: Success
 *       409:
 *          description: Cannot delete the medical-follow-up
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.follow_up WHERE id = $1', [parseInt(id)], result => {
            console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.ERROR_DELETE
                res.send('Cannot delete follow-up')
            } else {
                res.statusCode = STATUS_CODE.DELETED
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
 * /medical-follow-up/{id}/{id_establishment}:
 *   get:
 *     summary: Get medical-follow-up by id_user and id_estab.
 *     description: return medical-follow-up by id_user and id_estab.
 *     parameters:
 *      - name : id_user
 *        description: id of a user
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *      - name : id_establishment
 *        description: id of a establishment
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the medical-follow-up
 */
router.get('/:id_user/:id_estalishment', async (req, res) => {
    const query = 'SELECT public.follow_up.* FROM public.follow_up ' +
    'INNER JOIN public.service ON public.follow_up.id_service = public.service.id ' +
    'WHERE id_user = $1 AND id_etablishment = $2'
    try {
        await dao.connect()
        await dao.query(query, [parseInt(req.params.id_user), parseInt(req.params.id_estalishment)], result => {
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
 * /medical-follow-up/treatment-description:
 *   put:
 *     summary: update a follow-up (treatment_description)
 *     description: update the treatment_description
 *     parameters:
 *      - name : id
 *        description: id of the follow-up
 *        in: "formData"
 *        required: true
 *        type: integer
 *        format: int64
 *      - name : treatment-description
 *        description: treatment description of the follow-up
 *        in: "formData"
 *        required: true
 *        type: string
 *     responses:
 *       222:
 *         description: Success
 *       404:
 *          description: Cannot update the follow-up
 */
router.put('/treatment-description', async (req, res) => {
    const followUp = req.body
    console.log(followUp)
    try {
        await dao.connect()
        await dao.query('UPDATE public.follow_up SET treatment_description = $1 WHERE id = $2',
            [followUp.treatment_description, followUp.id], result => {
                console.log(result)
                if (result.rows.rowCount === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('Cannot desactivate user')
                } else {
                    res.statusCode = STATUS_CODE.DELETED
                    res.send('treatment_description updated')
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
 * /medical-follow-up/status:
 *   put:
 *     summary: update status of a follow-up
 *     description: update status of a follow-up
 *     parameters:
 *      - name : id
 *        description: id of the follow-up
 *        in: "formData"
 *        required: true
 *        type: integer
 *        format: int64
 *      - name : is_actif
 *        description: status of a follow-up
 *        in: "formData"
 *        required: true
 *        type: string
 *     responses:
 *       222:
 *         description: Success
 *       404:
 *          description: Cannot update the follow-up
 */
router.put('/status', async (req, res) => {
    const followUp = req.body
    console.log(followUp)
    try {
        await dao.connect()
        await dao.query('UPDATE public.follow_up SET is_actif = $1 WHERE id = $2',
            [followUp.is_actif, followUp.id], result => {
                console.log(result)
                if (result.rows.rowCount === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('Cannot desactivate user')
                } else {
                    res.statusCode = STATUS_CODE.DELETED
                    res.send('status updated')
                }
            })
    } catch (err) {
        console.error(err)
        res.send('Error ' + err)
    } finally {
        dao.disconnect()
    }
})
router.put('/deactivateChat', async (req, res) => {
    const followUp = req.body
    console.log(followUp)
    try {
        // sjsjsh
        await dao.connect()
        await dao.query('UPDATE public.follow_up SET is_active_chat = $1 WHERE id = $2',
            [followUp.is_actif, followUp.id], result => {
                console.log(result)
                if (result.rows.rowCount === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('Cannot desactivate user')
                } else {
                    res.statusCode = STATUS_CODE.DELETED
                    res.send('status updated')
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
 * /medical-follow-up/patient/active/{id_establishment}:
 *   get:
 *     summary: return active patients in a establishment
 *     description: Get all the active patients
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
 *          description: Cannot get the users
 */
router.get('/patient/active/:id_establishment', async (req, res) => {
    const idEstablishment = req.params.id_establishment
    const query = 'SELECT public."user".* FROM public."user" ' +
    'INNER JOIN public.follow_up ON public."user".id = id_user ' +
    'INNER JOIN public.service ON public.follow_up.id_service = public.service.id ' +
    'WHERE public.follow_up.is_actif = $1 AND id_etablishment = $2 AND public."user".id_role = $3'
    try {
        await dao.connect()
        await dao.query(query, [true, idEstablishment, ROLE.PATIENT], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find the patient')
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
 * /medical-follow-up/existing-patient:
 *   post:
 *     summary: add medical-follow-up existing patient
 *     description: add medical-follow-up existing patient
 *     parameters:
 *      - name : id_user
 *        description: id of the patient
 *        in: "formData"
 *        required: true
 *        type: integer
 *        format: int64
 *      - name : id_service
 *        description: id of service
 *        in: "formData"
 *        required: true
 *        type: integer
 *      - name : treatment_description
 *        description: treatment description
 *        in: "formData"
 *        required: true
 *        type: string
 *     responses:
 *       201:
 *         description: Success
 *       505:
 *          description: Cannot add the follow-up
 */
router.post('/existing-patient', async (req, res) => {
    console.log(req.body)
    try {
        await dao.connect()
        await dao.query('INSERT INTO public.follow_up (id_user,is_actif, id_service, treatment_description) VALUES ($1, $2, $3, $4) RETURNING id AS id_suivi',
            [parseInt(req.body.id_user), true, req.body.id_service, req.body.treatment_description], async result2 => {
                await dao.query('INSERT INTO public.user_establishment (id_etablishment, id_user) VALUES ($1, $2) ',
                    [req.body.id_establishment, parseInt(req.body.id_user)], result3 => {
                        res.statusCode = STATUS_CODE.UPDATE
                        // console.log(result1[0])
                        dao.disconnect()
                        req.body.id = req.body.id_user
                        // userEmail : medical.follow.up.ca@gmail.com, accessCode : req.body.access_code
                        sendMail(req.body.email, req.body.access_code)
                        res.send(JSON.stringify({
                            id: result2.rows[0].id_suivi,
                            idUser: req.body.id_user,
                            idService: req.body.id_service
                        }))
                    })
            }).catch(error => { console.log(error); res.send(error); dao.disconnect() })
    } catch (error) {
        dao.disconnect()
        res.statusCode = STATUS_CODE.ERROR_UPDATE
        console.log(error)
        res.send('Error ' + error)
    }
})

// Deactivate a follow-up
module.exports = router
