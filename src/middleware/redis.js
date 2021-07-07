const redis = require('redis')
const client = redis.createClient()
const helper = require('../helpers')

module.exports = {
  getMovieByIdRedis: (req, res, next) => {
    const { id } = req.params
    // console.log('Get data by id redis', id)
    client.get(`getmovie:${id}`, (error, result) => {
      if (!error && result != null) {
        console.log('data ada di dalam redis')
        return helper.response(
          res,
          200,
          `Succes Get Data by Id ${id} (Redis)`,
          JSON.parse(result)
        )
      } else {
        console.log('data tidak ada dalam redis')
        next()
      }
    })
  },
  getMovieRedis: (req, res, next) => {
    // console.log('Get data by id redis', id)
    client.get(`getmovie:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result != null) {
        console.log('data ada dalam redis')
        const newResult = JSON.parse(result)
        return helper.response(
          res,
          200,
          'Succes get movie All (redis)',
          newResult.result,
          newResult.pageInfo
        )
      } else {
        console.log('data tidak ada dalam redis')
        next()
      }
    })
  },
  clearDataMovieRedis: (req, res, next) => {
    // cari yang berawalan getmovie akhiran apapun
    client.keys('getmovie*', (_error, result) => {
      // _untuk param yang tidak dipakai tapi harus ada
      console.log('isi key dalam redis', result) // [array isi semua kunci yang ada awalan getmovie]
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  },
  getPremiereByMovie: (req, res, next) => {
    client.get(
      `getpremiere:${JSON.stringify(req.query)}`, // getpremiere:${JSON.stringify(req.params)}${JSON.stringify(req.query)}
      (error, result) => {
        if (!error && result != null) {
          console.log('data ada dalam redis')
          const newResult = JSON.parse(result)
          return helper.response(
            res,
            200,
            'Succes Get Premiere Data (redis)',
            newResult.result,
            newResult.pageInfo
          )
        } else {
          console.log('data tidak ada dalam redis')
          next()
        }
      }
    )
  },
  clearDataPremiereRedis: (req, res, next) => {
    client.keys('getpremiere*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  },
  getBookingRedis: (req, res, next) => {
    client.get(`getbook:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result != null) {
        console.log('data ada dalam redis')
        const newResult = JSON.parse(result)
        return helper.response(
          res,
          200,
          'Succes Get Booking Data (redis)',
          newResult.result,
          newResult.pageInfo
        )
      } else {
        console.log('data tidak ada dalam redis')
        next()
      }
    })
  },
  clearDataBookingRedis: (req, res, next) => {
    client.keys('getbookseat*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  }
}
