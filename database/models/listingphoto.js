'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListingPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Listing, {
        foreignKey: 'listingId', as: 'listing'
      });
    }
  }
  ListingPhoto.init({
    listingId: { type: DataTypes.INTEGER, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.INTEGER },
    isCover: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'ListingPhoto',
  });
  return ListingPhoto;
};