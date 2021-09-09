module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user', {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "email": {
                "type": Sequelize.STRING,
                "field": "email",
                "unique": true,
                "allowNull": false
            },
            "nama": {
                "type": Sequelize.STRING,
                "field": "nama",
                "allowNull": false
            },
            "password": {
                "type": Sequelize.STRING,
                "field": "password",
                "allowNull": false
            },
            "role": {
                "type": Sequelize.INTEGER,
                "field": "role",
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
        return queryInterface.dropTable('user');
    }
};