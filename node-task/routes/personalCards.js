const express = require("express")
const router = express.Router()

module.exports = dbInstance => {
  router.post("/", (req, res) => {
    const {
      body: { id, word, translate, word_image, translation_image, description },
      query: { dictionary_id }
    } = req

    const insertCardQuery =
      "INSERT INTO personal_cards (id, dictionary_id, word, translate, word_image, translation_image, description, deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    const insertCardParams = [
      id,
      dictionary_id,
      word,
      translate,
      word_image,
      translation_image,
      description,
      false,
      new Date().toISOString(),
      new Date().toISOString()
    ]

    dbInstance
      .execute(insertCardQuery, insertCardParams, { prepare: true })
      .then(() => {
        res.status(200).send()
      })
      .catch(err => {
        res.status(404).send(err)
      })
  })

  router.put("/:id", (req, res) => {
    const {
      body: { word, translate, word_image, translation_image, description },
      query: { dictionary_id }
    } = req

    const selectCardQuery =
      "SELECT * from personal_cards WHERE id = ? AND dictionary_id = ?"

    const selectCardParams = [`id_${req.params.id}`, dictionary_id]

    const updateCardQuery =
      "UPDATE personal_cards SET word = ?, translate = ?, word_image = ?, translation_image = ?, description = ?, updated_at = ? WHERE id = ? AND dictionary_id = ?"

    const updateCardParams = [
      word,
      translate,
      word_image,
      translation_image,
      description,
      new Date().toISOString(),
      `id_${req.params.id}`,
      dictionary_id
    ]

    dbInstance
      .execute(selectCardQuery, selectCardParams, {
        prepare: true
      })
      .then(selectResponce => {
        if (selectResponce.rowLength) {
          dbInstance
            .execute(updateCardQuery, updateCardParams, {
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
    const selectCardsQuery =
      "SELECT * from personal_cards WHERE id = ? AND dictionary_id = ?"

    const selectCardsParams = [`id_${req.params.id}`, req.query.dictionary_id]

    const deleteCardQuery =
      "UPDATE personal_cards SET deleted = ? WHERE id = ? AND dictionary_id = ?"

    const deleteCardParams = [
      true,
      `id_${req.params.id}`,
      req.query.dictionary_id
    ]

    dbInstance
      .execute(selectCardsQuery, selectCardsParams, {
        prepare: true
      })
      .then(selectResponce => {
        if (selectResponce.rowLength) {
          dbInstance
            .execute(deleteCardQuery, deleteCardParams, {
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
    const selectCardsQuery =
      "SELECT * from personal_cards WHERE dictionary_id = ? and deleted = ? ALLOW FILTERING"
    const selectCardsParams = [req.query.dictionary_id, false]

    dbInstance
      .execute(selectCardsQuery, selectCardsParams, { prepare: true })
      .then(selectResponce => {
        res.status(200).send(selectResponce.rows)
      })
      .catch(err => {
        res.status(404).send(`${err}`)
      })
  })
  return router
}
