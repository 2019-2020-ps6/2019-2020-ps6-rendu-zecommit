const { Router } = require('express')

const { Quiz, Stat } = require('../../models')
const QuestionRouter = require('./questions')
const { addQuestions, deleteQuestionsAndAnswers,addThemes } = require('../Manage')
const manageAllErrors = require('../../utils/routes/error-management')

const router = new Router()
router.use('/:quizId/questions', QuestionRouter)

router.get('/', (req, res) => {
  try {
    const quizzes = Quiz.get()
    let quizzesToSend = []
    quizzes.forEach(element => {
      let quiz = {...element,questions:addQuestions(element.id),theme:addThemes(element.themeId)}
      quizzesToSend.push(quiz)
    });
    res.status(200).json(quizzesToSend)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.get('/:quizId', (req, res) => {
  try {
    const quiz = {...Quiz.getById(req.params.quizId)}
    quiz.questions = addQuestions(quiz.id)
    quiz.theme=addThemes(quiz.themeId)
    res.status(200).json(quiz)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.post('/', (req, res) => {
  try {
    const quiz = Quiz.create({ ...req.body })
    res.status(201).json(quiz)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.delete('/:quizId', (req, res) => {
  try {
    deleteQuestionsAndAnswers(req.params.quizId)
    Stat.get().filter((stat)=> stat.quizId == req.params.quizId).forEach((stat)=>{
      Stat.delete(stat.id)
    })
    res.status(200).json(Quiz.delete(req.params.quizId))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.put('/:quizId', (req, res) => {
  try {
    res.status(200).json(Quiz.update(req.params.quizId,req.body))
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
