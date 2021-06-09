const express = require('express')
const router = express.Router()
const { dao, STATUS_CODE, ROLE } = require('../index')
const IS_USER_ACTIVE = true
const bcrypt = require('bcrypt')
const saltRounds = 10

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: return a user if exist
 *     description: Verify a user
 *     parameters:
 *      - name : email
 *        description: email unique d'un utilisateur
 *        in: "formData"
 *        require: true
 *        type: string
 *      - name : password
 *        description: email unique d'un utilisateur
 *        in: "formData"
 *        require: true
 *        type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get the user
 *
  */
router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    console.log(email)
    console.log(password)

    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.user WHERE email LIKE $1', [email], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Aucune donnée')
            } else {
                // Load hash from the db, which was preivously stored
                bcrypt.compare(password, result.rows[0].password, function (err, resBcrypt) { //
                    if (err || !resBcrypt) { //
                        res.statusCode = STATUS_CODE.NOT_FOUND//
                        res.send('Aucune donnée')//
                    } else { //
                        res.statusCode = STATUS_CODE.OK
                        res.send(result.rows)
                    }
                // else wrong password
                })//
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
 * /user/verify:
 *   post:
 *     summary: return a user (first time using CARE -> **needs to subscribe**) //select * from public."user" where "firstName" ILIKE 'test'
 *     description: Verify email (user) and access code from an establishment
 *     parameters:
 *      - name : email
 *        description: email unique d'un utilisateur
 *        in: "formData"
 *        require: true
 *        type: string
 *      - name : access_code
 *        description: access_code d'un utilisateur
 *        in: "formData"
 *        require: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get the user
 */
router.post('/verify', async (req, res) => {
    const email = req.body.email
    const accessCode = req.body.access_code
    console.log(email)
    console.log(accessCode)
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.user WHERE email LIKE $1 AND access_code = $2', [email, parseInt(accessCode)], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Aucune donnée')
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
 * /user/subscribe:
 *   put:
 *     summary: add info user (patient)
 *     description: add infos of a patient
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *         description: Cannot add info of the patient
 */
router.put('/subscribe', async (req, res) => {
    const user = req.body
    console.log('My user ' + user)
    bcrypt.hash(user.password, saltRounds, async (err, hash) => {
        if (err) {
            res.send(err)
        }
        try {
            await dao.connect()
            await dao.query('UPDATE public."user" SET "firstName"=$1, "lastName"=$2, date_of_birth=$3, phone=$4,password=$5, is_actif=$6, id_sexe=$7, access_code=$8 WHERE id =$9 AND access_code =$10',
                [user.firstName, user.lastName, user.date_of_birth, user.phone, hash, true, user.id_sexe, null, user.id, user.access_code], result => {
                    console.log(result)
                    if (result.rowCount === 0) {
                        res.statusCode = STATUS_CODE.NOT_FOUND
                        res.send('Cannot subscribe user')
                    } else {
                        res.statusCode = STATUS_CODE.UPDATE
                        res.send(true)
                    }
                })
        } catch (err) {
            // err
            console.error(err)
            res.send('Error ' + err)
        } finally {
            dao.disconnect()
        }
    })
})

/**
 * @swagger
 * /user:
 *   get:
 *     summary: return a list of users
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get list of users
 */
router.get('/', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.user', [], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find users')
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

router.get('/role/' + process.env.ACCESS_CODE + '/:id_role', async (req, res) => {
    const idRole = req.params.id_role
    console.log(idRole)
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.user WHERE id_role = $1', [parseInt(idRole)], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find the user')
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
 * /user/patient/active/{id_establishment}:
 *   get:
 *     summary: return active users in a establishment
 *     description: Get all the active users
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

    try {
        await dao.connect()
        await dao.query('SELECT public."user".* from public."user" INNER JOIN  public.user_establishment on public."user".id = id_user WHERE id_etablishment = $1 AND id_role = $2 AND Is_actif = $3',
            [idEstablishment, ROLE.PATIENT, true], result => {
                console.log(result)
                if (result.rows.length === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('cannot find the user')
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
 * /user/representant/active/{id_establishment}:
 *   get:
 *     summary: return active reps in a establishment
 *     description: Get all the active reps
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
router.get('/representant/active/:id_establishment', async (req, res) => {
    const idEstablishment = req.params.id_establishment

    try {
        await dao.connect()
        await dao.query('SELECT public."user".* from public."user" INNER JOIN  public.user_establishment on public."user".id = id_user WHERE id_etablishment = $1 AND id_role = $2 AND Is_actif = $3',
            [idEstablishment, ROLE.REPRESENTANT, true], result => {
                console.log(result)
                if (result.rows.length === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('cannot find the user')
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
 * /user/patient/inactive/{id_establishment}:
 *   get:
 *     summary: return inactive users in a establishment
 *     description: Get all the inactive users
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
router.get('/patient/inactive/:id_establishment', async (req, res) => {
    const idEstablishment = req.params.id_establishment
    try {
        await dao.connect()
        await dao.query('SELECT public."user".* from public."user" INNER JOIN  public.user_establishment on public."user".id = id_user WHERE id_etablishment = $1 AND id_role = $2 AND Is_actif = $3',
            [idEstablishment, ROLE.PATIENT, false], result => {
                console.log(result)
                if (result.rows.length === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('cannot find the user')
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
 * /user/representant/inactive/{id_establishment}:
 *   get:
 *     summary: return inactive reps in a establishment
 *     description: Get all the inactive reps
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
router.get('/representant/inactive/:id_establishment', async (req, res) => {
    const idEstablishment = req.params.id_establishment
    try {
        await dao.connect()
        await dao.query('SELECT public."user".* from public."user" INNER JOIN  public.user_establishment on public."user".id = id_user WHERE id_etablishment = $1 AND id_role = $2 AND Is_actif = $3',
            [idEstablishment, ROLE.REPRESENTANT, false], result => {
                console.log(result)
                if (result.rows.length === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('cannot find the user')
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
 * /user/{id}:
 *   get:
 *     summary: return a user
 *     description: Get a user
 *     parameters:
 *      - name : id
 *        description: get user by id
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot the user
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.user WHERE id = $1', [parseInt(id)], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find the user')
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
 * /user/email/{email}:
 *   get:
 *     summary: return a user by email
 *     description: Get a user by email
 *     parameters:
 *      - name : email
 *        description: email of a user
 *        in: "path"
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot the user
 */
router.get('/email/:email', async (req, res) => {
    const email = req.params.email
    console.log('email: ' + email)
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public."user" WHERE email like $1', [email], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find the user')
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
 * /user/patient:
 *   post:
 *     summary: Add a new patient (email unique)
 *     description: Add a user
 *     responses:
 *       201:
 *         description: The user is added
 *       444:
 *          description: Cannot add the user because email is already in use with us
 *       455:
 *          description: Acces code is not valid
 *
 */
// router.post('/patient', async (req, res) => {
//     const user = req.body
//     console.log(user)
//     try {
//         await dao.connect()
//         await dao.query('INSERT INTO public."user"("firstName", "lastName", date_of_birth, phone, email, password, is_actif, id_role, id_sexe)' +
//             'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [user.firstName, user.lastName, user.date_of_birth, user.phone, user.email, user.password, IS_USER_ACTIVE, ROLE.PATIENT,
//             user.id_sexe], result => {
//             console.log(result)
//             console.log(result.rowCount)
//             if (result.rowCount === 0) {
//                 res.statusCode = STATUS_CODE.NOT_FOUND
//                 res.send('patient cannot be added')
//             } else {
//                 res.statusCode = STATUS_CODE.UPDATE
//                 res.send(result.rows)
//             }
//         })
//     } catch (err) {
//         console.error(err)
//         res.send('Error ' + err)
//     } finally {
//         dao.disconnect()
//     }
// })
/// *********************************A DELETE *********************************************** */
// router.post('/patient', async (req, res) => {
//     const user = req.body
//     console.log(user)
//     try {
//         await dao.connect()
//         await dao.query('INSERT INTO public."user"("firstName", "lastName", date_of_birth, phone, email, password, is_actif, id_role, id_sexe, access_code)' +
//             'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [user.firstName, user.lastName, user.date_of_birth, user.phone, user.email, user.password, IS_USER_ACTIVE, ROLE.PATIENT,
//             user.id_sexe, user.acces_code], result => {
//             console.log(result)
//             console.log(result.rowCount)
//             if (result.rowCount === 0) {
//                 res.statusCode = STATUS_CODE.NOT_FOUND
//                 res.send('patient cannot be added')
//             } else {
//                 res.statusCode = STATUS_CODE.UPDATE
//                 res.send(result.rows)
//             }
//         })
//     } catch (err) {
//         console.error(err)
//         res.send('Error ' + err)
//     }
//     dao.disconnect()
// })

/**
 * @swagger
 * /user/representant:
 *   post:
 *     summary: Add a new representant (email unique)
 *     description: Add a representant
 *     responses:
 *       201:
 *         description: The representant is added
 *       444:
 *          description: Cannot add the representant because email is already in use with us
 *       404:
 *          description: cannot added the representant
 */
router.post('/representant', async (req, res) => {
    const representant = req.body.representant
    const idEstablishment = req.body.idEstablishment
    console.log(representant)
    bcrypt.hash(representant.password, saltRounds, async (err, hash) => {
        if (err) {
            res.send(err)
        }
        try {
            await dao.connect()
            await dao.query('INSERT INTO public."user"("firstName", "lastName", date_of_birth, phone, email, password, is_actif, id_role, id_sexe, poste)' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id AS id_representant', [representant.firstName, representant.lastName, representant.date_of_birth, representant.phone, representant.email, hash, IS_USER_ACTIVE, ROLE.REPRESENTANT,
                representant.id_sexe, representant.poste], async result => {
                console.log(result)
                console.log(result.rowCount)
                if (result.rowCount === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('representative cannot be added')
                } else {
                    await dao.query('INSERT INTO public.user_establishment(id_etablishment, id_user)' +
                    'VALUES ($1, $2) RETURNING id', [idEstablishment, result.rows[0].id_representant], result => {
                        res.statusCode = STATUS_CODE.UPDATE
                        dao.disconnect()
                        res.send(true)
                    })
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
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user if exist (ADMIN)
 *     description: Delete a user
 *     parameters:
 *      - name : id
 *        description: delete the user
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       222:
 *         description: Success
 *       409:
 *          description: Cannot delete the user
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        await dao.connect()
        await dao.query('DELETE FROM public.user WHERE id = $1', [parseInt(id)], result => {
            console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.ERROR_DELETE
                res.send('Cannot delete user')
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
/**
 * @swagger
 * /user/desactivate/{id}:
 *   put:
 *     summary: desactivate a user if exist (Representant)
 *     description: desactivate a user
 *     parameters:
 *      - name : id
 *        description: id of the user
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       222:
 *         description: Success
 *       404:
 *          description: Cannot desactivate the user
 */
router.put('/desactivate/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        await dao.connect()
        await dao.query('UPDATE public."user" SET is_actif=false WHERE id = $1', [parseInt(id)], result => {
            console.log(result)
            if (result.rows.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Cannot desactivate user')
            } else {
                res.statusCode = STATUS_CODE.DELETED
                res.send('Desactivated')
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
 * /user/activate/{id}:
 *   put:
 *     summary: activate a user if exist (Representant)
 *     description: activate a user
 *     parameters:
 *      - name : id
 *        description: id of the user
 *        in: "path"
 *        required: true
 *        type: integer
 *        format: int64
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *          description: Cannot activate the user
 *
 */
router.put('/activate/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        await dao.connect()
        await dao.query('UPDATE public."user" SET is_actif=true WHERE id = $1', [parseInt(id)], result => {
            console.log(result)
            if (result.rows.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Cannot desactivate user')
            } else {
                res.statusCode = STATUS_CODE.OK
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
 * /user/representant:
 *   put:
 *     summary: Update info user (representant)
 *     description: Update infos of a representant
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *          description: Cannot update info of the representant
 */
router.put('/representant', async (req, res) => {
    const user = req.body
    console.log('My user ' + user)
    try {
        await dao.connect()
        await dao.query('UPDATE public."user" SET "firstName"=$1, "lastName"=$2, phone=$3, email=$4,' +
         'id_sexe=$5, poste=$6 WHERE id = $7', [user.firstName, user.lastName, user.phone, user.email, user.id_sexe, user.poste, user.id_user], result => {
            console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Cannot update user')
            } else {
                res.statusCode = STATUS_CODE.UPDATE
                res.send(true)
            }
        })
    } catch (err) {
        // err
        console.error(err)
        res.send('Error ' + err)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /user/patient:
 *   put:
 *     summary: Update info user (patient)
 *     description: Update infos of a patient
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *          description: Cannot update info of the representant
 */
router.put('/patient', async (req, res) => {
    const user = req.body
    console.log('My user ' + user)
    try {
        await dao.connect()
        await dao.query('UPDATE public."user" SET "firstName"=$1, "lastName"=$2, date_of_birth=$3, phone=$4, email=$5,' +
         'id_sexe=$6 WHERE id = $7', [user.firstName, user.lastName, user.date_of_birth, user.phone, user.email, user.id_sexe, user.id], result => {
            console.log(result)
            if (result.rowCount === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('Cannot update user')
            } else {
                res.statusCode = STATUS_CODE.UPDATE
                res.send(true)
            }
        })
    } catch (err) {
        // err
        console.error(err)
        res.send('Error ' + err)
    } finally {
        dao.disconnect()
    }
})

/**
 * @swagger
 * /user/representant/{id_establishment}:
 *   get:
 *     summary: return all reps in an establishment
 *     description: Get all reps in an establishment
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
 *          description: Cannot get list of reps
 */
router.get('/representant/:id_establishment', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * from public."user" INNER JOIN  public.user_establishment on public."user".id = id_user WHERE id_etablishment = $1 AND id_role = $2',
            [parseInt(req.params.id_establishment), ROLE.REPRESENTANT], result => {
                console.log(result)
                if (result.rows.length === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('cannot find representants')
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
 * /user/patient/{id_establishment}:
 *   get:
 *     summary: return all patients in an establishment
 *     description: Get all patients in an establishment
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get list of patients
 */
router.get('/patient/:id_establishment', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * from public."user" INNER JOIN  public.user_establishment on public."user".id = id_user WHERE id_etablishment = $1 AND id_role = $2',
            [parseInt(req.params.id_establishment), ROLE.PATIENT], result => {
                console.log(result)
                if (result.rows.length === 0) {
                    res.statusCode = STATUS_CODE.NOT_FOUND
                    res.send('cannot find representants')
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
 * /user/active-follow-up/{id_establishment}:
 *   get:
 *     summary: patients that has active follow-up in estab.
 *     description: Get all patients that has active follow-up in estab.
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: Cannot get list of patients
 */
router.get('/active-follow-up/:id_establishment', async (req, res) => {
    const query = 'SELECT public."user".* FROM public."user" ' +
    'INNER JOIN public.follow_up ON public."user".id = id_user ' +
    'INNER JOIN public.service ON public.follow_up.id_service = public.service.id ' +
    'WHERE public.follow_up.is_actif = $1 AND public.service.id_etablishment = $2'

    try {
        await dao.connect()
        await dao.query(query, [true, parseInt(req.params.id_establishment)], result => {
            console.log(result)
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send('cannot find representants')
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
// delete represntents
router.delete('/table_user_establishmnt/:id_user', async (req, res) => {
    await dao.connect()
    await dao.query('Delete from user_establishment where id_user = $1', [parseInt(req.params.id_user)], result => {
        res.send('DELETED')
        dao.disconnect()
    }).catch(err => {
        res.send(err)
        dao.disconnect()
    })
})
router.delete('/table_user/:id_user', async (req, res) => {
    await dao.connect()
    await dao.query('Delete from public."user" where id = $1', [parseInt(req.params.id_user)], result => {
        res.send('DELETED')
        dao.disconnect()
    }).catch(err => {
        res.send(err)
        dao.disconnect()
    })
})
router.delete('/table_follow_up/:idFollowUp', async (req, res) => {
    await dao.connect()
    await dao.query('Delete from public."follow_up"', [], result => {
        res.send('DELETED')
        dao.disconnect()
    }).catch(err => {
        res.send(err)
        dao.disconnect()
    })
})
router.delete('/table_question_follow_up/:idFollowUp', async (req, res) => {
    await dao.connect()
    await dao.query('Delete from public."question_follow_up" where id_follow_up = $1', [parseInt(req.params.idFollowUp)], result => {
        res.send('DELETED')
        dao.disconnect()
    }).catch(err => {
        res.send(err)
        dao.disconnect()
    })
})
// delete un patient
module.exports = router
