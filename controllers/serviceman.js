const errors = require('../errors/index.js')
const {Role, User} = require('../models')
const { Op } = require("sequelize");
const returnJson = require('../custom_functions/return_json.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')

const getServicemen = async (req, res, next) => {

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    const status = req.query.status

    if(status !== undefined && status !== null) {
        if(status !== 'active' && status !== 'inactive' && status !== 'suspended') {
            return next(new errors.BadRequestError('Invalid status provided'))
        }
    }

    try {

        let result = {}

        if(status !== undefined && status !== null) {
            result = await User.findAll({
                where: {status: status},
                include: [{
                    association: 'serviceman_profile',
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id', 'services', 'zone_id', 'longitude', 'latitude', 'services', 'availability']},
                    required: true,
                }],
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude: ['updated_at', 'password_hash', 'profile_image', 'email_verified_at', 'suspension_note']}
            })
        } else {
            result = await User.findAll({
                include: [{
                    association: 'serviceman_profile',
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id', 'zone_id','latitude','longitude','services','availability','id_card_front','id_card_back','identification_number','identification_expiry','note']},
                    required: true,
                }],
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude:  ['updated_at', 'password_hash', 'profile_image', 'email_verified_at', 'suspension_note',]}
            })
        }

        if(result.length > 0){
            result = result.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.serviceman_profile,
                    serviceman_profile: undefined
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched servicemen',
            data: result,
            limit: paginationData.limit,
            page: paginationData.page
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }

}

const getSingleServiceman = async (req, res, next) => {

    try {

        let result = {}
     
        result = await User.findByPk(req.params.id, {
            include: [{
                association: 'serviceman_profile',
                attributes: {exclude: ['id','updated_at', 'preferences', 'user_id',]},
                required: true,
            }],
            attributes: {exclude: ['updated_at', 'password_hash']}
        })

        if(result === null || result === undefined) {
            return next(new errors.NotFoundError('Serviceman not found'))
        }
        
        result = {
            ...result.toJSON(),
            ...result.serviceman_profile?.toJSON(),
            serviceman_profile: undefined
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched serviceman',
            data: result,
        })
    } catch(e) {
        console.log(e)
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const getServicemenStats = async (req, res, next) => {
    try {
        const total = await User.count({
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'serviceman' },
                through: { attributes: [] },
                required: true,
            }]
        })

        const active = await User.count({
            where: {status: 'active'},
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'serviceman' },
                through: { attributes: [] },
                required: true,
            }]
        })

        const in_active = await User.count({
            where: {
                status: {
                    [Op.or]: ['inactive', 'suspended']
                },
            },
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'serviceman' },
                through: { attributes: [] },
                required: true,
            }]
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched servicemen stats',
            data: {total, active, in_active}
        })

    } catch(e) {
        console.log(e)
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const getNewServicemenRequests = async (req, res, next) => {
    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        const result = await User.findAll({
            where: {status: 'pending'},
            include: [{
                association: 'serviceman_profile',
                attributes: {exclude: ['updated_at', 'id', 'user_id', 'preferences', 'services', 'longitude', 'zone_id', 'latitude','total_orders', 'earnings','availability']},
                required: true,
            }],
            attributes: {exclude: ['updated_at','password_hash','rating','suspension_note','profile_image']}
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched new servicemen requests',
            data: result,
            limit: paginationData.limit,
            page: paginationData.page
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const updateCustomerDetails = async (req, res, next) => {


}

const changeServicemanStatus = async (req, res, next) => {

    const servicemanId = req.params.id

    try {
        const status = await serviceman.findOne({
            attributes: ['status'],
            where: {id: servicemanId}
        })

        await serviceman.update({
            status: status.status === 1 ? 0 : 1
        }, {where: {id: servicemanId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Serviceman Status Updated Successfully'
        })

    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const changeServicemanAccountSuspension = async (req, res, next) => {
     const userId = req.params.id
    
    if((req.resource.status === 'active' || req.resource.status === 'inactive') && (req.body.suspension_note === undefined || req.body.suspension_note === null)) {        
        return next(new errors.BadRequestError('Suspension note is required'))
    }

    try {
        await User.update({
            status: req.resource.status === 'active' ? 'suspended' : 'active',
            suspension_note: req.resource.status === 'active' ? req.body.suspension_note : null
            }, {where: {id: userId}}
        )

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Serviceman Account Suspension Updated Successfully'
        })
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const deleteServiceman = async (req, res, next) => {

    const userId = req.params.id

    try {
        await User.destroy({where: {id: userId}})

        return returnJson({
            res: res, 
            statusCode: 200,
            message: 'Serviceman Account Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }

}

module.exports = {
  getServicemen,
  getServicemenStats,
  getSingleServiceman,
  updateCustomerDetails,
  changeServicemanStatus,
  changeServicemanAccountSuspension,
  deleteServiceman,
  getNewServicemenRequests,

}