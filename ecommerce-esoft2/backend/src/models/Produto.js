// backend/src/models/Produto.js
import { Model, DataTypes } from 'sequelize';

class Produto extends Model {
    static init(sequelize) {
        super.init({
            ID_produto: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            Descricao: {
                type: DataTypes.TEXT
            },
            Preco: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            Estoque: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            Ativo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
            // Categoria_ID (FK) e Vendedor_ID (FK) são adicionadas no db.js
        }, {
            sequelize,
            modelName: 'Produto',
            tableName: 'Produto'
        });
        return this;
    }
}
export default Produto;