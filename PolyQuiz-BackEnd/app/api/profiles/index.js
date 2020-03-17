const { Router } = require('express')

const { Profile } = require('../../models')

const router = new Router()

router.get('/', (req, res) => {
  try {
    res.status(200).json(Profile.get())
  } catch (err) {
    res.status(500).json(err)
  }
})


router.get('/:profileId', (req, res) => {
  try {
    res.status(200).json(Profile.getById(req.params.profileId))
  } catch (err) {
    res.status(404).json(err)
  }
})

router.post('/', (req, res) => {
  try {
    const profile = Profile.create({ ...req.body })
    res.status(201).json(profile)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra)
    } else {
      res.status(500).json(err)
    }
  }
})

router.delete('/:profileId', (req, res) => {
  try {
    res.status(200).json(Profile.delete(req.params.profileId))
  } catch (err) {
    res.status(404).json(err)
  }
})

router.put('/:profileId', (req, res) => {
  try {
    res.status(200).json(Quiz.update(req.params.profileId,req.body))
  } catch (err) {
    res.status(404).json(err)
  }
})

module.exports = router