import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const canCreateStudent = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Create', 'Create Student'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canUpdateStudent = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Update', 'Update Student'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canDeleteStudent = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Delete', 'Delete Student'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canCreateClass = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Create'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canUpdateClass = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Update'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canDeleteClass = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Delete'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canCreateTeacher = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Create'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canUpdateTeacher = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Update'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canDeleteTeacher = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Delete'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});


export const canConfirmAttendence = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Confirm Attendence'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canConfirmPayment = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Confirm Payment'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});

export const canDeleteSubitem = catchAsync(async function (req, res, next) {
    if (req.user.role === 'rootAdmin') return next();
    const permissions = ['Delete'];
    if (req.user?.permissions.some(permission => permissions.includes(permission))) {
        return next();
    }
    return next(new AppError(`You don't have the required permissions to perform this action`, 403));
});