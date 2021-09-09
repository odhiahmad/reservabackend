module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('menu', {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "idMenu": {
                "type": Sequelize.INTEGER,
                "field": "idMenu",
                "allowNull": false
            },
            "nama": {
                "type": Sequelize.STRING,
                "field": "nama",
                "unique": true,
                "allowNull": false
            },
            "icon": {
                "type": Sequelize.STRING,
                "field": "icon",
                "allowNull": false
            },
            "keterangan": {
                "type": Sequelize.STRING,
                "field": "keterangan",
                "allowNull": false
            },
            "status": {
                "type": Sequelize.INTEGER,
                "field": "status",
                "allowNull": false
            },
            "statusMenu": {
                "type": Sequelize.INTEGER,
                "field": "statusMenu",
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('menu');
    }
};