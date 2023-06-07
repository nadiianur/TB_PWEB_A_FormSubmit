const { Sequelize } = require("sequelize");
const db = require("../config/database.js");
const { DataTypes } = Sequelize;

const Submission = db.define(
  'Submission',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references : {
        model : 'User',
        key : 'user_id'
      }
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references : {
        model : 'Form',
        key : 'form_id'
      }
    },
    uploaded_file: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE,
    },
    update_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'update_at',
  }
);

Submission.associate = (models) => {
  Submission.belongsTo(models.Form, {foreignKey: 'form_id'});
  Submission.belongsTo(models.User, {foreignKey: 'user_id'});
};

module.exports = Submission;
