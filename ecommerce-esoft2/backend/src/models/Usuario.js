// backend/src/models/Usuario.js
import { Model, DataTypes } from 'sequelize';

class Usuario extends Model {
    static init(sequelize) {
        super.init({
            ID_usuario: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            Email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: { isEmail: true }
            },
            Senha_hash: { // Note o nome exato da coluna
                type: DataTypes.STRING(255),
                allowNull: false,
                field: 'Senha_hash' // Garante o nome do campo no BD
            },
            Telefone: {
                type: DataTypes.STRING(20)
            },
            Data_cadastro: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW // Preenche automaticamente
            },
            Ativo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
            // TipoUsuario_ID (A chave estrangeira) é adicionada automaticamente
            // pela associação no db.js
        }, {
            sequelize,
            modelName: 'Usuario',
            tableName: 'Usuario'
        });
        return this;
    }
}
export default Usuario;