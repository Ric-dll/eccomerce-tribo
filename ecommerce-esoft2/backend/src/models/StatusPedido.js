import { Model, DataTypes } from 'sequelize';

class StatusPedido extends Model {
    static init(sequelize) {
        super.init({
            ID_StatusPedido: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            modelName: 'StatusPedido',
            tableName: 'StatusPedido'
        });
        return this;
    }
}
export default StatusPedido;