const helper = require('../../helpers')
const showTimeModel = require('./show_time_model')

module.exports = {
  sayHello: (req, res) => {
    res.status(200).send('Hello show_time')
  },
  getShowTimeById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await showTimeModel.getDataById(id)

      if (result.length > 0) {
        return helper.response(res, 200, `Succes Get Data by Id ${id}`, result)
      } else {
        return helper.response(res, 404, `Data by Id ${id} not Found !`, null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  postShowTime: async (req, res) => {
    try {
      const { premiereId, showTimeDate, showTimeClock } = req.body
      const setData = {
        premiere_id: premiereId,
        show_time_date: showTimeDate,
        show_time_clock: showTimeClock
      }
      console.log(setData)
      const result = await showTimeModel.createData(setData)
      return helper.response(res, 200, 'Succes Create Data', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateShowTime: async (req, res) => {
    try {
      const { id } = req.params
      let result = await showTimeModel.getDataById(id)

      if (result.length > 0) {
        const { premiereId, showTimeDate, showTimeClock } = req.body
        const setData = {
          premiere_id: premiereId,
          show_time_date: showTimeDate,
          show_time_clock: showTimeClock,
          show_time_updated_at: new Date(Date.now())
        }
        result = await showTimeModel.updateData(setData, id)
        return helper.response(res, 200, 'Succes Update Show Time', result)
      } else {
        return helper.response(
          res,
          404,
          `Cannnot Update !. Data by Id ${id} not Found !`,
          null
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  deletedShowTime: async (req, res) => {
    try {
      const { id } = req.params
      let result = await showTimeModel.getDataById(id)

      if (result.length > 0) {
        result = await showTimeModel.deleteData(id)
        return helper.response(
          res,
          200,
          `Succes Delete Show Time With ID ${id}`,
          result
        )
      } else {
        return helper.response(
          res,
          404,
          `Cannot Delete !.s Data by Id ${id} not Found !`,
          null
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
