const express = require('express')
const router = express.Router()
const { dao, STATUS_CODE } = require('../index')
const format = require('date-format')
/**
 * @swagger
 * /question/basic/:id_establishment:
 *   get:
 *     summary: return all basic questions of an establishment
 *     description: return basic questions of an establishment
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the questions
 */
router.get('/basic', async (req, res) => {
    // connectez vous
    // Reuperer les questions de base
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.question WHERE is_extra = false ', [], async result => {
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send(null)
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
 * /question/extra/:id_establishment:
 *   get:
 *     summary: return all extra questions of an establishment
 *     description: return extra questions of an establishment
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the questions
 */
router.get('/extra/:id_establishment', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.question WHERE is_extra = true AND WHERE id_establishment = $1', [parseInt(req.params.id_establishment)], result => {
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
 * /question/basic:
 *   post:
 *     summary: Add a new question
 *     description: Add a question
 *     parameters:
 *     responses:
 *       201:
 *         description: The question is added
 *       444:
 *          description: Cannot add the question
 */
router.post('/basic', async (req, res) => {
    const question = req.body.question
    const response = req.body.response
    try {
        await dao.connect()
        await dao.query('INSERT INTO public.question (question, is_boolean,is_multiple_choice,is_emoticon,is_range,is_extra,' +
            'id_establishment) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id AS id_question', [question.question, question.is_boolean, question.is_multiple_choice,
            question.is_emoticon, question.is_range, false, question.id_establishment], async result1 => {
            const queryTemplate = []
            const values = []
            let cpt = 1
            response.forEach(element => {
                queryTemplate.push('($' + cpt++ + ',$' + cpt++ + ')') // ($1,$2) ,
                values.push(parseInt(result1.rows[0].id_question), element)
            })
            const query = 'INSERT INTO public.question_response (id_question, response) VALUES ' + queryTemplate.join(',')
            console.log(query)
            await dao.query(query, values, result2 => {
                console.log('question basic')
                dao.disconnect()
            }).catch(error => { console.log(error); res.send(error) })

            res.statusCode = STATUS_CODE.UPDATE
            res.end('Added')
        })
    } catch (error) {
        res.statusCode = STATUS_CODE.ERROR_UPDATE
        dao.disconnect()
        res.send(error)
    }
})

/**
 * @swagger
 * /question/follow-up:
 *   post:
 *     summary: Add a new question in a follow-up
 *     description: Add a question
 *     parameters:
 *     responses:
 *       201:
 *         description: The question is added
 *       444:
 *          description: Cannot add the question
 */
router.post('/follow-up', async (req, res) => {
    const idSuivi = req.body.id_suivi
    const extraQuestions = req.body.extra_questions
    const idBasicQuestions = req.body.id_basic_questions
    // fonction uile
    const insertsQuestionsFollowUp = () => {
        idBasicQuestions.forEach(async (element, index, array) => {
            await dao.query('INSERT INTO public.question_follow_up (id_follow_up, id_question, amplitude_jour) VALUES ($1, $2, $3)',
                [idSuivi, element.id_question, element.amplitude_jour],
                result => {
                    console.log('question_basic_follow_up_added')
                    if (index === array.length - 1) {
                        dao.disconnect()
                        res.statusCode = STATUS_CODE.UPDATE
                        console.log('Questions List Added')
                        res.send('Questions List Added')
                    }
                }).catch(error => { console.log(error); res.send(error) })
        })
    }
    // extra questions
    await dao.connect()
    extraQuestions.forEach(async (extraQuestion, index, arrayExtraQuestion) => {
        await dao.query('INSERT INTO public.question (question, id_establishment, is_boolean, is_multiple_choice , is_emoticon, is_range, is_extra)  VALUES  ($1, $2, $3 ,$4 ,$5 ,$6 ,$7) returning id as id_question',
            [extraQuestion.question.question, extraQuestion.question.id_establishment, extraQuestion.question.is_boolean, extraQuestion.question.is_multiple_choice, extraQuestion.question.is_emoticon, extraQuestion.question.is_range, extraQuestion.question.is_extra],
            async result1 => {
                // INSERER les reponses pour chaque question
                const queryTemplate = []
                const values = []
                let cpt = 1
                const responses = extraQuestion.responses
                responses.forEach(response => {
                    queryTemplate.push('($' + cpt++ + ',$' + cpt++ + ')') // ($1,$2) ,
                    values.push(parseInt(result1.rows[0].id_question), response)
                })
                const query = 'INSERT INTO public.question_response (id_question, response) VALUES ' + queryTemplate.join(',')
                await dao.query(query, values, async result2 => {
                    console.log('question et response extra added')
                    await dao.query('INSERT INTO public.question_follow_up (id_follow_up, id_question, amplitude_jour) VALUES ($1, $2, $3)',
                        [idSuivi, result1.rows[0].id_question, extraQuestion.amplitude_jour], result3 => {
                            console.log('question_extra_follow_up_added')
                            if (index === arrayExtraQuestion.length - 1) {
                                /// basic question
                                insertsQuestionsFollowUp()
                            }
                        }
                    ).catch(error => { console.log(error); res.send(error) })
                    // assigner aussi la question au patient dans la table suivi
                }).catch(error => { console.log(error); res.send(error) })
            }
        ).catch(error => { console.log(error); res.send(error) })
    })
    // dans le cas ou y'a aucun question extra
    if (extraQuestions.length === 0) {
        insertsQuestionsFollowUp()
    }
})
/**
 * @swagger
 * /question/follow-up/:id_follow_up:
 *   get:
 *     summary: return all questions by id_follow_up
 *     description: return all questions by id_follow_up
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Cannot get the questions
 */
router.get('/follow-up/:id_follow_up', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.question INNER JOIN  public.question_follow_up ON public.question.id = id_question WHERE id_follow_up = $1', [parseInt(req.params.id_follow_up)], async result => {
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
 * /question/responses:
 *   post:
 *     summary: Add a new response
 *     description: Add a response
 *     responses:
 *       201:
 *         description: The response is added
 *       404:
 *          description: cannot added the response
 */
router.post('/response', async (req, res) => {
    const responses = req.body

    console.log(responses)
    try {
        await dao.connect()
        responses.forEach(async (response, index, array) => {
            console.log(response)
            if (response.responses !== undefined) {
                response.responses.forEach(async (value, i, arr) => {
                    await dao.query('INSERT INTO public.follow_up_question_response (id_question_follow_up, id_question_response) ' +
                                    ' VALUES ($1,$2 )', [response.id_question_follow_up, value.id], async result => {
                        console.log(result)
                        if (result.rowCount === 0) {
                            res.statusCode = STATUS_CODE.NOT_FOUND
                            res.send('response follow_up cannot be added')
                        } else {
                            // if (index === array.length - 1) {
                            //     // dao.disconnect()
                            //     res.statusCode = STATUS_CODE.UPDATE
                            //     console.log('Responses List Added')
                            //     res.send('Responses List Added')
                            // }
                            if (i === arr.length - 1 && index === array.length - 1) {
                                res.statusCode = STATUS_CODE.UPDATE
                                console.log('Responses List Added')
                                res.send('Responses List Added')
                            }
                        }
                    }).catch(error => { console.log(error); res.send(error) })
                })
            } else if (response.rangeValue !== undefined) {
                await dao.query('INSERT INTO public.question_response (id_question, response)' +
                    ' VALUES ($1, $2) returning id; ', [response.id_question, response.rangeValue], async result => {
                    await dao.query('INSERT INTO public.follow_up_question_response (id_question_follow_up, id_question_response) VALUES ($1, $2)',
                        [response.id_question_follow_up, result.rows[0].id],
                        async result => {
                            if (result.rowCount === 0) {
                                res.statusCode = STATUS_CODE.ERROR_UPDATE
                                res.send('response range not added cannot be added')
                            } else {
                                if (index === array.length - 1) {
                                    // dao.disconnect()
                                    res.statusCode = STATUS_CODE.UPDATE
                                    res.send('Responses List Added')
                                }
                            }
                        }).catch(error => { console.log(error); res.send(error) })
                }).catch(error => { console.log(error); res.send(error) })
            } else {
                await dao.query('INSERT INTO public.follow_up_question_response (id_question_follow_up, id_question_response) ' +
                ' VALUES ($1,$2 )', [response.id_question_follow_up, response.id_question_response], async result => {
                    console.log(result)
                    if (result.rowCount === 0) {
                        res.statusCode = STATUS_CODE.NOT_FOUND
                        res.send('response follow_up cannot be added')
                    } else {
                        if (index === array.length - 1) {
                            // dao.disconnect()
                            res.statusCode = STATUS_CODE.UPDATE
                            console.log('Responses List Added')
                            res.send('Responses List Added')
                        }
                    }
                }).catch(error => { console.log(error); res.send(error) })
            }
        })
    } catch (err) {
        dao.disconnect()
        console.error(err)
        res.send('Error ' + err)
    }
})

// recuperer les questions selon id
router.get('/:id', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.question WHERE id = $1', [parseInt(req.params.id)], async result => {
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
// recuperer les questions du jour
router.get('/follow-up-day/:id_follow_up', async (req, res) => {
    try {
        await dao.connect()
        const query = 'SELECT  public.question_follow_up.*  FROM public.follow_up ' +
        ' INNER JOIN  question_follow_up on public.follow_up.id = id_follow_up ' +
        ' WHERE (SELECT (CAST(MAX(now()) AS date) - CAST(MIN(\'2021-04-03\') AS date)) as datediff) % amplitude_jour = 0  and id_follow_up = $1'

        await dao.query(query, [parseInt(req.params.id_follow_up)], async result => {
            if (result.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.send(null)
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

// recuperer les reponses par id_question
router.get('/responses/:id', async (req, res) => {
    try {
        await dao.connect()
        await dao.query('SELECT * FROM public.question_response WHERE id_question = $1', [parseInt(req.params.id)], async result => {
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

// // recuperer differents date de reponse d'un suivi
// router.get('/responses/distinct-date/:idFollowUp', async (req, res) => {
//     try {
//         await dao.connect()
//         const queryString = 'SELECT  DISTINCT date_response from public.follow_up_question_response ' +
//        ' INNER JOIN public.question_follow_up ON public.question_follow_up.id = id_question_follow_up ' +
//        ' ORDER BY date_response DESC'
//         await dao.query(queryString, [], async result => {
//             if (result.rows.length === 0) {
//                 res.statusCode = STATUS_CODE.NOT_FOUND
//                 res.end(null)
//             } else {
//                 res.send(result.rows)
//             }
//         })
//     } catch (error) {
//         res.send(error)
//     } finally {
//         dao.disconnect()
//     }
// })
// router.get('/responses/distinct-date/:idFollowUp', async (req, res) => {
//     try {
//         await dao.connect()
//         const queryString = 'SELECT  DISTINCT date_response from public.follow_up_question_response ' +
//        ' INNER JOIN public.question_follow_up ON public.question_follow_up.id = id_question_follow_up ' +
//       '  WHERE id_follow_up = $1  ORDER BY date_response DESC'
//         await dao.query(queryString, [parseInt(req.params.idFollowUp)], async result => {
//             if (result.rows.length === 0) {
//                 res.statusCode = STATUS_CODE.NOT_FOUND
//                 res.end(null)
//             } else {
//                 res.send(result.rows)
//             }
//         })
//     } catch (error) {
//         res.send(error)
//     } finally {
//         dao.disconnect()
//     }
// })
// recuperer les reponses et question selon date de reponse decroissant
router.get('/responses/distinct/:idFollowUp', async (req, res) => {
    try {
        await dao.connect()
        // modification suite
        const queryString = 'SELECT  DISTINCT date_response from public.follow_up_question_response ' +
        ' INNER JOIN public.question_follow_up ON public.question_follow_up.id = id_question_follow_up ' +
       '  WHERE id_follow_up = $1  ORDER BY date_response DESC'
        await dao.query(queryString, [parseInt(req.params.idFollowUp)], async result1 => {
            if (result1.rows.length === 0) {
                res.statusCode = STATUS_CODE.NOT_FOUND
                res.end(null)
            } else {
                const responsesHistory = []
                result1.rows.forEach(async (value, index) => {
                    const queryStr = 'SELECT public.question.*,response from public.question_follow_up INNER JOIN follow_up_question_response on id_question_follow_up = public.question_follow_up.id' +
                    ' INNER JOIN public.question on public.question.id = public.question_follow_up.id_question ' +
                    ' INNER JOIN public.question_response on id_question_response =public.question_response.id ' +
                    ' WHERE id_follow_up = $1 and date_response = $2'
                    await dao.query(queryStr, [parseInt(req.params.idFollowUp), value.date_response], async result2 => {
                        if (result2.rows.length === 0) {
                            res.statusCode = STATUS_CODE.NOT_FOUND
                            res.end(null)
                        } else {
                            responsesHistory.push(
                                {
                                    date_response: value.date_response,
                                    responses: result2.rows
                                }
                            )
                            if (index === result1.rows.length - 1) {
                                dao.disconnect()
                                res.send(responsesHistory)
                            }
                        }
                    }).catch(error => { console.log(error); res.send(error) })
                })
            }
        })
    } catch (error) {
        res.send(error)
        dao.disconnect()
    }
})
// router.get('/responses/:idFollowUp/:response_date', async (req, res) => {
//     try {
//         await dao.connect()
//         const queryString = 'SELECT public.question.*, response from public.follow_up_question_response ' +
//         ' INNER JOIN public.question_follow_up ON public.question_follow_up.id = id_question_follow_up ' +
//         ' INNER JOIN public.question_response on public.question_response.id =  public.follow_up_question_response.id ' +
//         ' INNER JOIN public.question on public.question.id = public.question_response.id ' +
//         ' WHERE  date_response = $1 ORDER BY date_response DESC '
//         await dao.query(queryString, [req.params.response_date], async result => {
//             if (result.rows.length === 0) {
//                 res.statusCode = STATUS_CODE.NOT_FOUND
//                 res.end(null)
//             } else {
//                 res.send(result.rows)
//             }
//         })
//     } catch (error) {
//         res.send(error)
//     } finally {
//         dao.disconnect()
//     }
// })
module.exports = router
