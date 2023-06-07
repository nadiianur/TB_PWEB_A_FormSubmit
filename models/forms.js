const { Sequelize } = require("sequelize");
const db = require("../config/database.js");
const { DataTypes } = Sequelize;

const Form = db.define(
  'Form',
  {
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      references : {
        model : 'User',
        key : 'user_id'
      }
    },
    tittle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'forms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'update_at',
  }
)

Form.associate = (models) => {
  Form.belongsTo(models.User, {foreignKey: 'user_id'})
};

module.exports = Form;
