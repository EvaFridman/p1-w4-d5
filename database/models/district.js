'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Listing, {
        foreignKey: 'districtId', as: 'listings'
      });
    }
  }
  District.init({
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    city: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'District',
  });
  return District;
};