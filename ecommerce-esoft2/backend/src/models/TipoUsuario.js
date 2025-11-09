// backend/src/models/TipoUsuario.js
import { Model, DataTypes } from 'sequelize';

class TipoUsuario extends Model {
    static init(sequelize) {
        super.init({
            ID_Tipo: {
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
            modelName: 'TipoUsuario',
            tableName: 'TipoUsuario' // Nome exato da tabela
        });
        return this;
    }
}
export default TipoUsuario;