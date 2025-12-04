import { Model, DataTypes } from 'sequelize';

class Categoria extends Model {
    static init(sequelize) {
        super.init({
            ID_categoria: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            },
            Descricao: {
                type: DataTypes.TEXT
            }
            // Categoria_pai_ID (FK) é adicionada pela associação no db.js
        }, {
            sequelize,
            modelName: 'Categoria',
            tableName: 'Categoria'
        });
        return this;
    }
}
export default Categoria;