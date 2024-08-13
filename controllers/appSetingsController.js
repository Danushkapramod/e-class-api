import { getModelByTenant } from "../configs/database.js"
import catchAsync from "../utils/catchAsync.js"



export const getAppSetings = catchAsync(async function (req, res) {
    const AppSettings = getModelByTenant(req.tenantId,"AppSetings")
    const appSettings = await AppSettings.findOneAndUpdate({},{},
      {
          new: true, 
          upsert: true,
          setDefaultsOnInsert: true 
      }
  )
    res.status(200).json(appSettings)
})


export const updateAppSetings = catchAsync(async function (req, res,next) {
    if(!req.body)return next()
    const AppSettings = getModelByTenant(req.tenantId,"AppSetings")
    await AppSettings.findOneAndUpdate({},req.body)

    res.status(200).json()
  })


export const statusOptionsDefault = catchAsync(async function (req, res) {
  const AppSettings = getModelByTenant(req.tenantId,"AppSetings")
  const appSettings =  await AppSettings.findOne()
  if(!appSettings) return
  appSettings.statusOptionsDefault()

  res.status(200).json()
})