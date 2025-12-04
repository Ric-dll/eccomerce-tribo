import { Model, DataTypes } from 'sequelize';

class Carrinho extends Model {
    static init(sequelize) {
        super.init({
            ID_carrinho: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            DataCriacao: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        }, {
            sequelize,
            modelName: 'Carrinho',
            tableName: 'Carrinho'
        });
        return this;
    }
}
export default Carrinho;