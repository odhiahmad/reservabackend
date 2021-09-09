module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('role', {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "nama": {
                "type": Sequelize.STRING,
                "field": "nama",
                "unique": true,
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
        return queryInterface.dropTable('users');
    }
};