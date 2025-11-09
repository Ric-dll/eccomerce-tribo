// backend/src/models/Vendedor.js
import { Model, DataTypes } from 'sequelize';

class Vendedor extends Model {
    static init(sequelize) {
        super.init({
            ID_usuario: { // PK e FK
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Usuario',
                    key: 'ID_usuario'
                }
            },
            AreaResponsavel: {
                type: DataTypes.STRING(100)
            }
        }, {
            sequelize,
            modelName: 'Vendedor',
            tableName: 'Vendedor'
        });
        return this;
    }
}
export default Vendedor;