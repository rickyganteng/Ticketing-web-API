const helper = require('../../helpers')
const premiereModel = require('./premiere_model')
const locationModel = require('./location_model')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  getPremiereName: async (req, res) => {
    try {
      const result = await premiereModel.premiereName()
      return helper.response(res, 200, 'Succes get premiere name', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  premiereInfoByMovieId: async (req, res) => {
    try {
      // console.log('movie ID', req.params)

      let { movieId, loc, date, orderBy, limit } = req.query

      limit = limit || '6'
      loc = loc || '%%'
      date = date || '%%'
      orderBy = orderBy || 'p.premiere_name DESC'

      limit = parseInt(limit)
      const totalData = await premiereModel.getCountPremiere(
        movieId,
        loc,
        orderBy
      )
      console.log('total data pre', totalData)
      console.log('Total Data ' + totalData)

      const pageInfo = {
        limit,
        totalData
      }

      const result = await premiereModel.premiereInfoByMovie(
        movieId,
        loc,
        orderBy,
        limit
      )
      for (const e of result) {
        e.showTime = await premiereModel.showTimeInfoByPremiere(
          e.premiere_id,
          date
        )
      }
      client.setex(
        `getpremiere:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result })
      )
      return helper.response(
        res,
        200,
        `Succes get Premiere Info By Movie Id ${movieId}`,
        result,
        pageInfo
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getAllPremiere: async (req, res) => {
    try {
      const result = await premiereModel.getDataAll()
      return helper.response(res, 200, 'Succes Get Premiere Data', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getAllLocation: async (req, res) => {
    try {
      const result = await locationModel.getDataAll()
      return helper.response(res, 200, 'Succes Get Location Data', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getPremiereById: async (req, res) => {
    try {
      // console.log(req.params)
      const { id } = req.params
      const result = await premiereModel.getDataById(id)
      // console.log(result) array ini

      if (result.length > 0) {
        return helper.response(res, 200, `Succes Get Data by Id ${id}`, result)
      } else {
        return helper.response(res, 404, `Data by Id ${id} not Found !`, null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getLocationById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await locationModel.getDataById(id)

      if (result.length > 0) {
        return helper.response(res, 200, `Succes Get Data by Id ${id}`, result)
      } else {
        return helper.response(res, 404, `Data by Id ${id} not Found !`, null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  postPremiere: async (req, res) => {
    try {
      // console.log(req.body)
      const { movieId, locationId, premiereName, premierePrice } = req.body
      const setData = {
        movie_id: movieId,
        location_id: locationId,
        premiere_name: premiereName,
        premiere_price: premierePrice,
        premiere_logo: req.file ? req.file.filename : ''
      }
      // console.log(setData)
      const result = await premiereModel.createData(setData)
      return helper.response(res, 200, 'Succes Create Data', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  postLocation: async (req, res) => {
    try {
      const { locationCity, locationAddres } = req.body
      const setData = {
        location_city: locationCity,
        location_addres: locationAddres
      }

      const result = await locationModel.createData(setData)
      return helper.response(res, 200, 'Succes Create Data', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updatePremiere: async (req, res) => {
    try {
      const { id } = req.params
      let result = await premiereModel.getDataById(id)

      if (result.length > 0) {
        const { movieId, locationId, premiereName, premierePrice } = req.body
        const setData = {
          movie_id: movieId,
          location_id: locationId,
          premiere_name: premiereName,
          premiere_price: premierePrice,
          premiere_logo: req.file ? req.file.filename : '',
          premiere_updated_at: new Date(Date.now())
        }
        console.log('Pre data', setData)

        if (result[0].premiere_logo.length > 0) {
          console.log(`Delete Image${result[0].premiere_logo}`)
          const imgLoc = `src/uploads/${result[0].premiere_logo}`
          helper.deleteImage(imgLoc)
        } else {
          console.log('NO img in DB')
        }

        result = await premiereModel.updateData(setData, id)
        return helper.response(res, 200, 'Succes Update Premiere', result)
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
  updateLocation: async (req, res) => {
    try {
      const { id } = req.params
      let result = await locationModel.getDataById(id)

      if (result.length > 0) {
        const { locationCity, locationAddres } = req.body
        const setData = {
          location_city: locationCity,
          location_addres: locationAddres,
          location_updated_at: new Date(Date.now())
        }
        result = await locationModel.updateData(setData, id)
        return helper.response(res, 200, 'Succes Update Location', result)
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
  deletedPremiere: async (req, res) => {
    try {
      const { id } = req.params
      let result = await premiereModel.getDataById(id)

      if (result.length > 0) {
        const imgLoc = `src/uploads/${result[0].premiere_logo}`
        helper.deleteImage(imgLoc)
        result = await premiereModel.deleteData(id)
        return helper.response(
          res,
          200,
          `Succes Delete Premiere With ID ${id}`,
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
  },
  deletedLocation: async (req, res) => {
    try {
      const { id } = req.params
      let result = await locationModel.getDataById(id)

      if (result.length > 0) {
        result = await locationModel.deleteData(id)
        return helper.response(
          res,
          200,
          `Succes Delete Location With ID ${id}`,
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
