const model = require('../../models/index');
const { Op } = require("sequelize");

const menu = async () => {
    const getMenu = await model.tbMenu.findAll({
        where: {
            status_menu: 0
        }
    })
    return getMenu
}

const menuSub = async () => {
    const getMenuSub = await model.tbMenu.findAll({
        where: {
            [Op.and]: [
                { id_menu: !0 },
                { id_menu_sub: 0 }
            ]
        }
    })
    return getMenuSub
}

const menuSubSub = () => {
    return model.tbMenu.findAll({
        where: {
            [Op.and]: [
                { id_menu: !0 },
                { id_menu_sub: !0 }
            ]
        }
    })
}

exports.menu = menu;
exports.menuSub = menuSub;
exports.menuSubSub = menuSubSub;


