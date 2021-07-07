const helper = require('../../helpers')
const userModel = require('./user_model')

module.exports = {
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.decodeToken.user_id
      const userProfileImage = req.decodeToken.user_profile_image
      console.log('holahol', userId)
      const { firstName, lastName, userPhoneNumber } = req.body
      const setData = {
        user_name: firstName + ' ' + lastName,
        user_phone_number: userPhoneNumber,
        user_profile_image: req.file ? req.file.filename : ''
      }
      // console.log('Data', setData)

      const imgLoc = `src/uploads/${userProfileImage}`
      helper.deleteImage(imgLoc)

      const result = await userModel.updateProfile(setData, userId)
      return helper.response(
        res,
        200,
        'Succes Update Profile (Please get New token) !',
        result
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getShowTimeById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.getDataById(id)

      if (result.length > 0) {
        return helper.response(res, 200, `Succes Get Data by Id ${id}`, result)
      } else {
        return helper.response(res, 404, `Data by Id ${id} not Found !`, null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
