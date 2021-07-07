const helper = require('../../helpers')
const bcrypt = require('bcrypt')
const authModel = require('./auth_model')
const jwt = require('jsonwebtoken')

module.exports = {
  register: async (req, res) => {
    try {
      // console.log(req.body)
      const {
        userEmail,
        userPassword,
        firstName,
        lastName,
        userPhoneNumber
      } = req.body

      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(userPassword, salt)
      // console.log(`before Encrypt = ${userPassword}`)
      // console.log(`after Encrypt = ${encryptPassword}`)

      const setData = {
        user_name: firstName + ' ' + lastName,
        user_email: userEmail,
        user_password: encryptPassword,
        user_phone_number: userPhoneNumber
      }

      const checkEmailUser = await authModel.getDataCondition({
        user_email: userEmail
      })

      if (checkEmailUser.length === 0) {
        const result = await authModel.register(setData)
        delete result.user_password

        const url = `http://localhost:3001/backend1/api/v1/auth/change-data/${result.id}`

        // send email for verificatioan here
        helper.sendMail('Please activate your account', url, userEmail)

        return helper.response(
          res,
          200,
          'Succes register User Please Check your Email to Activate your Account !',
          result
        )
      } else {
        return helper.response(res, 400, 'Email has been registered')
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  },

  login: async (req, res) => {
    try {
      // console.log(req.body)
      const { userEmail, userPassword } = req.body
      // 1. cek email ada di db atau tidak
      const checkEmailUser = await authModel.getDataCondition({
        user_email: userEmail
      })

      if (checkEmailUser.length > 0) {
        if (checkEmailUser[0].user_verification === 'pending') {
          return helper.response(res, 403, 'Account is not verified')
        }

        const checkPassword = bcrypt.compareSync(
          userPassword,
          checkEmailUser[0].user_password
        )

        if (checkPassword) {
          console.log('User berhasil login')
          const payload = checkEmailUser[0]
          delete payload.user_password
          const token = jwt.sign({ ...payload }, 'RAHASIA', {
            expiresIn: '24h'
          })

          const result = { ...payload, token }
          return helper.response(res, 200, 'Succes Login !', result)
        } else {
          return helper.response(res, 400, 'Worng password')
        }
      } else {
        return helper.response(res, 404, 'Email not Registed')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  changeData: async (req, res) => {
    try {
      let token = req.params.token
      let userId = ''
      let setData = {}
      console.log(token)
      if (/^\d+$/.test(token)) {
        userId = token
        setData = { user_verification: 'succes' }
      } else {
        jwt.verify(token, 'RAHASIA', (error, result) => {
          if (
            (error && error.name === 'JsonWebTokenError') ||
            (error && error.name === 'TokenExpiredError')
          ) {
            return helper.response(res, 403, error.message)
          } else {
            // console.log('DECODE token', result)
            token = result
          }
        })
        userId = token.userId
        setData = token.setData
      }

      if (userId && setData) {
        console.log('Update', setData)
        const result = await authModel.updateData(setData, userId)
        return helper.response(
          res,
          200,
          'succes update data',
          Object.keys(result)
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  requestChange: async (req, res) => {
    try {
      if (req.body.userPassword) {
        const salt = bcrypt.genSaltSync(10)
        const encryptPassword = bcrypt.hashSync(req.body.userPassword, salt)
        req.body.userPassword = encryptPassword
      } else if (req.body.userEmail) {
        const checkEmailUser = await authModel.getDataCondition({
          user_email: req.body.userEmail
        })
        console.log(req.body.userEmail)
        if (checkEmailUser.length > 0) {
          return helper.response(res, 400, 'Email has been registered')
        }
      } else {
        return helper.response(res, 400, 'Bad Request')
      }
      // console.log('PASSS', req.body.userPassword)

      const setData = {}
      for (const key in req.body) {
        setData[helper.convertToSnakeCase(key)] = req.body[key]
      }
      console.log('SETDATA', setData)

      const payload = {
        userId: req.decodeToken.user_id,
        setData: setData
      }
      // console.log(payload)
      const token = jwt.sign({ ...payload }, 'RAHASIA', {
        expiresIn: '24h'
      })

      const url = `http://localhost:3001/backend1/api/v1/auth/change-data/${token}`

      // send email for verificatioan here
      helper.sendMail(
        `Confirm your ${Object.keys(setData)
          .map((e) => e.split('_')[1])
          .join(' and ')} change `,
        url,
        req.body.userEmail ? req.body.userEmail : req.decodeToken.user_email
      )

      return helper.response(
        res,
        200,
        'Email verification has been sent, please check your email !',
        url
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
