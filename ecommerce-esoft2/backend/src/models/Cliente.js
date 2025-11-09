// backend/src/models/Cliente.js
import { Model, DataTypes } from 'sequelize';

class Cliente extends Model {
    static init(sequelize) {
        super.init({
            ID_usuario: { // Esta é a PK e a FK ao mesmo tempo
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Usuario', // Referencia a tabela Usuario
                    key: 'ID_usuario'
                }
            },
            CPF: {
                type: DataTypes.STRING(14),
                allowNull: false,
                unique: true
            },
            DataNasc: {
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            modelName: 'Cliente',
            tableName: 'Cliente'
        });
        return this;
    }
}
export default Cliente;