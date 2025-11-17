// backend/src/models/Carrinho.js
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
            // Cliente_ID é a Chave Estrangeira (definida no db.js)
        }, {
            sequelize,
            modelName: 'Carrinho',
            tableName: 'Carrinho'
        });
        return this;
    }
}
export default Carrinho;