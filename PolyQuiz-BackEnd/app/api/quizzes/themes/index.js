const { Router } = require('express')

const { Theme, Quiz } = require('../../../models')

const { deleteAttachedImg, addImage } = require('../../Manage')

const manageAllErrors = require('../../../utils/routes/error-management')

const router = new Router()

router.get('/', (req, res) => {
  try {
    const themes = []
    Theme.get().forEach(theme => {
      let themeToSend = {...theme}
      themeToSend.image = addImage(themeToSend.image)
      themes.push(themeToSend)
    })
    res.status(200).json(themes)
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.get('/:themeId', (req, res) => {
  try {
    const theme = { ...Theme.getById(req.params.themeId)}
    theme.image = addImage(theme.image)
    res.status(200).json(theme)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.post('/', (req, res) => {
  try {
    const theme = Theme.create({ ...req.body })
    res.status(201).json(theme)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.delete('/:themeId', (req, res) => {
  try {
    const theme =  Theme.getById(req.params.themeId);
    Quiz.get().filter((quiz)=>quiz.themeId==req.params.themeId).forEach(element => {
      element.themeId = 0
      if(element.image==theme.image) element.image = Theme.getById(0).image
      Quiz.update(element.id,element)
    });
    deleteAttachedImg(theme.image)
    res.status(200).json(Theme.delete(req.params.themeId))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.put('/:themeId', (req, res) => {
  try {
    const theme =  Theme.getById(req.params.themeId);
    const line = req.body.image.split('/')
    req.body.image = line[line.length-1]
    Quiz.get().filter((quiz)=>quiz.themeId==req.params.themeId && quiz.image == theme.image).forEach(element => {
      element.image = req.body.image
      Quiz.update(element.id,element)
    });
    if(theme.image != req.body.image) deleteAttachedImg(theme.image)
    res.status(200).json(Theme.update(req.params.themeId,req.body))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
