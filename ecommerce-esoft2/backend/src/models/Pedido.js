// backend/src/models/Pedido.js
import { Model, DataTypes } from 'sequelize';

class Pedido extends Model {
    static init(sequelize) {
        super.init({
            ID_pedido: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            DataPedido: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            Total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            // Este ID virá do frontend (Pessoa 2)
            EnderecoEntrega_ID: {
                type: DataTypes.INTEGER,
                allowNull: false 
            }
            // StatusPedido_ID (FK), Cliente_ID (FK) serão definidos no db.js
        }, {
            sequelize,
            modelName: 'Pedido',
            tableName: 'Pedido'
        });
        return this;
    }
}
export default Pedido;