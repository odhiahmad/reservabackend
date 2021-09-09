module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('fungsi', {
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
            "idRole": {
                "type": Sequelize.INTEGER,
                "field": "idRole",
                "allowNull": false
            },
            "fungsi": {
                "type": Sequelize.STRING,
                "field": "fungsi",
                "allowNull": false
            },
            "status": {
                "type": Sequelize.INTEGER,
                "field": "status",
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
        return queryInterface.dropTable('fungsi');
    }
};