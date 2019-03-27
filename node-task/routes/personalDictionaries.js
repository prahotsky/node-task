const express = require("express")
const router = express.Router()

module.exports = dbInstance => {
  router.post("/", (req, res) => {
    const {
      body: {
        id,
        name,
        native_language_id,
        study_language_id,
        premium,
        type,
        code
      },
      query: { user_id }
    } = req
    const insertDictionaryQuery =
      "INSERT INTO personal_dictionaries (user_id, id, name, native_language_id, study_language_id, premium, deleted, created_at, updated_at, type, code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    const insertDictionaryParams = [
      user_id,
      id,
      name,
      native_language_id,
      study_language_id,
      premium,
      false,
      new Date().toISOString(),
      new Date().toISOString(),
      type,
      code
    ]

    dbInstance
      .execute(insertDictionaryQuery, insertDictionaryParams, {
        prepare: true
      })
      .then(() => {
        res.status(200).send()
      })
      .catch(err => {
        res.status(404).send(err)
      })
  })

  router.put("/:id", (req, res) => {
    const {
      body: {
        name,
        native_language_id,
        study_language_id,
        premium,
        type,
        code
      },
      query: { user_id }
    } = req

    const selectDictionaryQuery =
      "SELECT * from personal_dictionaries WHERE id = ? AND user_id = ?"

    const selectDictionaryParams = [`id_${req.params.id}`, user_id]

    const updateDictionaryQuery =
      "UPDATE personal_dictionaries SET name = ?, native_language_id = ?, study_language_id = ?, premium = ?, updated_at = ?, type = ?, code = ? WHERE id = ? AND user_id = ?"

    const updateDictionaryParams = [
      name,
      native_language_id,
      study_language_id,
      premium,
      new Date().toISOString(),
      type,
      code,
      `id_${req.params.id}`,
      user_id
    ]

    dbInstance
      .execute(selectDictionaryQuery, selectDictionaryParams, {
        prepare: true
      })
      .then(selectResponce => {
        if (selectResponce.rowLength) {
          dbInstance
            .execute(updateDictionaryQuery, updateDictionaryParams, {
              prepare: true
            })
            .then(() => {
              res.status(200).send()
            })
            .catch(err => {
              res.status(404).send(`${err}`)
            })
        } else throw new Error("Row not exists")
      })
      .catch(err => {
        res.status(404).send(`${err}`)
      })
  })

  router.delete("/:id", (req, res) => {
    const selectDictionariesQuery =
      "SELECT * from personal_dictionaries WHERE id = ? AND user_id = ?"

    const selectDictionariesParams = [`id_${req.params.id}`, req.query.user_id]

    const deleteDictionaryQuery =
      "UPDATE personal_dictionaries SET deleted = ? WHERE id = ? AND user_id = ?"

    const deleteDictionaryParams = [
      true,
      `id_${req.params.id}`,
      req.query.user_id
    ]

    dbInstance
      .execute(selectDictionariesQuery, selectDictionariesParams, {
        prepare: true
      })
      .then(selectResponce => {
        if (selectResponce.rowLength) {
          dbInstance
            .execute(deleteDictionaryQuery, deleteDictionaryParams, {
              prepare: true
            })
            .then(() => {
              res.status(200).send()
            })
            .catch(err => {
              res.status(404).send(`${err}`)
            })
        } else throw new Error("Row not exists")
      })
      .catch(err => {
        res.status(404).send(`${err}`)
      })
  })

  router.get("/", (req, res) => {
    const selectDictionariesQuery =
      "SELECT * from personal_dictionaries WHERE user_id = ? AND deleted = ? ALLOW FILTERING"
    const selectDictionariesParams = [req.query.user_id, false]

    dbInstance
      .execute(selectDictionariesQuery, selectDictionariesParams, {
        prepare: true
      })
      .then(selectResponce => {
        res.status(200).send(selectResponce.rows)
      })
      .catch(err => {
        res.status(404).send(`${err}`)
      })
  })

  return router
}
