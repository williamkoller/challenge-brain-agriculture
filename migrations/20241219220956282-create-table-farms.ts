import { DataTypes, Migration } from './umzugClient';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('farms', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    producer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'producers',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    arable_area: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    total_area: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    vegetation_area: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    land_use: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('farms');
};
