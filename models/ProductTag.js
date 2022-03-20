const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

class ProductTag extends Model {}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Product",
        key: "id",
        unique: false,
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Tag",
        key: "id",
        unique: false,
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "product_tag",
  }
);

module.exports = ProductTag;

/*
ProductTag

id:
Integer.
Doesn't allow null values.
Set as primary key.
Uses auto increment.

product_id:
Integer.
References the Product model's id.

tag_id:
Integer.
References the Tag model's id.
*/
